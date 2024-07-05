import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule ,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

/**
 * Componente para el formulario de cambio de contraseña.
 * @description Este componente permite a los usuarios solicitar un cambio de contraseña ingresando su correo electrónico.
 * Si el correo está registrado en el sistema, se envía un correo electrónico con instrucciones para el cambio de contraseña.
 * Si el correo no está registrado, se muestra un mensaje de error indicando que el correo no está en la base de datos.
 */

export class ChangePasswordComponent implements OnInit {

   /**
   * FormGroup que contiene los campos del formulario de cambio de contraseña.
   * @type {FormGroup} Objeto FormGroup que maneja los controles y validaciones del formulario.
   */
  changePasswordForm: FormGroup;

   /**
   * Bandera para indicar si el correo electrónico no está registrado en el sistema.
   * @type {boolean} true si el correo electrónico no está registrado, de lo contrario false.
   */
  correoNoRegistrado: boolean = false;

  /**
   * Bandera para indicar si el correo electrónico ha sido enviado correctamente para el cambio de contraseña.
   * @type {boolean} true si el correo electrónico ha sido enviado correctamente, de lo contrario false.
   */
  correoEnviado: boolean = false;

  /**
   * Mensaje de error que se muestra cuando ocurre un problema durante el proceso de cambio de contraseña.
   * @type {string} Cadena de texto que contiene el mensaje de error específico.
   */
  mensajeError: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

   /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */

  ngOnInit(): void {}

  /**
   * Método que se llama cuando se envía el formulario de cambio de contraseña.
   * Verifica la validez del formulario, verifica si el correo electrónico está registrado y maneja los resultados.
   */

  onSubmit(): void {
    this.correoNoRegistrado = false;
    this.correoEnviado = false;

    if (this.changePasswordForm.valid) {
      const email = this.changePasswordForm.get('email')?.value;

      console.log('Email:', email);

      // Verificar si el correo electrónico está registrado
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find((user: any) => user.email === email);

      if (usuario) {
        this.correoEnviado = true;
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 4000);

      } else {
        this.correoNoRegistrado = true;
      }
    } else {
      this.changePasswordForm.markAllAsTouched(); // Para mostrar los errores de validación
    }
  }
}