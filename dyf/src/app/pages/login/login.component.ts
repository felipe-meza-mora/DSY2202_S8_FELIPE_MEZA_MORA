import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsersService } from '../../service/users.service';

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


  constructor(private fb: FormBuilder, private router: Router, private usersService: UsersService) {}


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

  async onSubmit(): Promise<void> {
    const email = this.formLogin.get('email')?.value;
    const password = this.formLogin.get('password')?.value;

    try {
      const usuario = await this.usersService.validateUser(email, password);
      if (usuario) {
        // Guardar la sesión del usuario en localStorage
        localStorage.setItem('sesionUsuario', JSON.stringify(usuario));

        // Navegar a la página principal
        this.router.navigate(['/']); 
        //window.location.reload();
        //window.location.href = '/';

        // Limpiar mensaje de error si hubiera alguno previo
        this.mensajeError = null; 
        // Reiniciar el estado de correo no registrado
        this.correoNoRegistrado = false; 
      } else {
        this.mensajeError = 'La contraseña ingresada es incorrecta';
        this.correoNoRegistrado = true; // Establecer el estado de correo no registrado
      }
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      this.mensajeError = 'Hubo un error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.';
    }
  }
}