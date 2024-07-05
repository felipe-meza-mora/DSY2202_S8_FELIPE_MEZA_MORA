import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { validarRut } from '../../validators/rut.validator';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})

/**
 * Componente para la gestión del perfil de usuario.
 * @description Este componente permite al usuario actualizar sus datos personales, incluyendo el nombre, email, contraseña, teléfono, permisos y dirección de envío.
 */

export class PerfilComponent implements OnInit {

   /**
   * FormGroup que contiene los controles del formulario de registro.
   * @type {FormGroup} Grupo de controles del formulario.
   */
  formRegistro!: FormGroup;
  
  /**
   * Mensaje de éxito mostrado al actualizar los datos del perfil.
   * @type {string} Mensaje que indica que los datos se actualizaron correctamente.
   */

  mensajeExito: string = '';

  constructor(private fb: FormBuilder, private router: Router) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa el formulario de registro con validadores y carga los datos del usuario si están disponibles en el almacenamiento local.
   */

  ngOnInit(): void {
    this.formRegistro = this.fb.group({
      rut: ['', [Validators.required, validarRut]],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.passwordValidator()],
      confirmPassword: [''],
      telefono: ['', Validators.required],
      permisos: [''],
      direccionEnvio: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });

    this.loadUserData();
  }

  /**
   * Método para cargar los datos del usuario actual en el formulario desde el almacenamiento local.
   * Si los datos del usuario están disponibles, se establecen en el formulario de registro.
   */

  loadUserData(): void {
    const sesionUsuario = localStorage.getItem('sesionUsuario');
    if (sesionUsuario) {
      const userData = JSON.parse(sesionUsuario);
      this.formRegistro.patchValue({
        rut: userData.rut,
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        permisos: userData.permisos,
        direccionEnvio: userData.direccionEnvio
      });
      // El campo de la contraseña y confirmación se dejan en blanco por seguridad
    }
  }

   /**
   * Validador personalizado para la contraseña que verifica la complejidad de la misma.
   * @param control Control de formulario que contiene el valor de la contraseña.
   * @returns {ValidationErrors | null} Objeto de errores si la contraseña no cumple con los requisitos de complejidad, o null si es válida.
   */

  passwordValidator(): Validators | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const errors: any = {};

      if (value && !/[A-Z]/.test(value)) {
        errors.missingUppercase = 'Debe contener al menos una letra mayúscula';
      }
      if (value && !/[a-z]/.test(value)) {
        errors.missingLowercase = 'Debe contener al menos una letra minúscula';
      }
      if (value && !/[0-9]/.test(value)) {
        errors.missingNumber = 'Debe contener al menos un número';
      }
      if (value && !/[\W_]/.test(value)) {
        errors.missingSpecial = 'Debe contener al menos un carácter especial';
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

   /**
   * Validador de coincidencia de contraseñas que verifica si la contraseña y su confirmación coinciden.
   * @param group FormGroup que contiene los campos de contraseña y confirmación.
   * @returns {ValidationErrors | null} Objeto de errores si las contraseñas no coinciden, o null si coinciden.
   */

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Método para enviar el formulario de registro.
   * Si el formulario es válido, actualiza los datos del usuario en el almacenamiento local y muestra un mensaje de éxito antes de redirigir al usuario.
   */

  submitForm(): void {
    if (this.formRegistro.valid) {
      const updatedUserData = this.formRegistro.value;

      const sesionUsuario = localStorage.getItem('sesionUsuario');
      let currentPassword = '';

      if (sesionUsuario) {
        const userData = JSON.parse(sesionUsuario);
        currentPassword = userData.password;
      }

      // Si no se proporcionan nuevas contraseñas, mantenemos la contraseña existente
      if (!updatedUserData.password) {
        updatedUserData.password = currentPassword;
      }
      delete updatedUserData.confirmPassword;

      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const index = usuarios.findIndex((user: any) => user.email === updatedUserData.email);

      if (index !== -1) {
        usuarios[index] = updatedUserData;
      } else {
        usuarios.push(updatedUserData);
      }

      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      localStorage.setItem('sesionUsuario', JSON.stringify(updatedUserData));

      this.mensajeExito = 'Datos actualizados con éxito.';
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 4000);

    }
  }

  /**
   * Método para limpiar el formulario de registro, restableciendo todos los campos a su estado inicial.
   */

  limpiarFormulario(): void {
    this.formRegistro.reset();
  }
}
