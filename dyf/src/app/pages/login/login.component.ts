import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * Componente para la autenticación de usuarios mediante correo electrónico y contraseña.
 * @description Este componente permite a los usuarios iniciar sesión verificando las credenciales con los datos almacenados en el local storage.
 */

export class LoginComponent implements OnInit {

  /**
   * FormGroup que contiene los campos de correo electrónico y contraseña del formulario de inicio de sesión.
   * @type {FormGroup} FormGroup del formulario de inicio de sesión.
   */
  formLogin!: FormGroup;

  /**
   * Mensaje de error que se muestra si la contraseña ingresada es incorrecta.
   * @type {string | null} Mensaje de error o nulo si no hay error.
   */
  mensajeError: string | null = null;


  /**
   * Variable para manejar el estado de correo no registrado.
   * @type {boolean} True si el correo electrónico no está registrado, false si está registrado.
   */
  correoNoRegistrado = false;


  constructor(private fb: FormBuilder, private router: Router) {}


  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Crea el FormGroup para el formulario de inicio de sesión con validaciones de correo electrónico y contraseña.
   */

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

   /**
   * Método que maneja el envío del formulario de inicio de sesión.
   * Verifica si el correo electrónico está registrado y si la contraseña es correcta.
   * Guarda la sesión del usuario en localStorage y navega a la página principal si las credenciales son válidas.
   * Muestra mensajes de error si las credenciales no son válidas.
   */

  onSubmit(): void {
    const email = this.formLogin.get('email')?.value;
    const password = this.formLogin.get('password')?.value;

    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    // Verificar si el correo electrónico está registrado
    const usuarioRegistrado = usuarios.find((usuario: any) => usuario.email === email);

    if (usuarioRegistrado) {
      if (usuarioRegistrado.password === password) {
        // Guardar la sesión del usuario en localStorage
        localStorage.setItem('sesionUsuario', JSON.stringify(usuarioRegistrado));

        // Navegar a la página principal
        
        //this.router.navigate(['/']); 
        window.location.reload();
        window.location.href = '/';

        // Limpiar mensaje de error si hubiera alguno previo
        this.mensajeError = null; 
        // Reiniciar el estado de correo no registrado
        this.correoNoRegistrado = false; 
      } else {
        this.mensajeError = 'La contraseña ingresada es incorrecta';
      }
    } else {
      this.correoNoRegistrado = true; // Establecer el estado de correo no registrado
    }
  }
}