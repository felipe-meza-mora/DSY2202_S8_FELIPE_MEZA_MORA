import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up.component';

/**
 * Suite de pruebas para SignUpComponent.
 */

describe('SignUpComponent', () => {

  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

   /**
   * Configura TestBed antes de cada prueba.
   * @usageNotes Se llama automáticamente antes de cada prueba para configurar el entorno de pruebas con los módulos necesarios.
   */

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SignUpComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Prueba unitaria para verificar que SignUpComponent se crea correctamente.
   * @description Verifica que el componente SignUpComponent se haya inicializado correctamente.
   * @return {void}
   */



  it('Debería crear', () => {
    expect(component).toBeTruthy();
  });

   /**
   * Prueba unitaria para verificar que el formulario de registro se inicializa correctamente.
   * @description Verifica que el formulario de registro (formRegistro) se inicialice con todos los campos requeridos.
   * @return {void}
   */

  it('Debería inicializar el formulario ', () => {
    expect(component.formRegistro).toBeDefined();
    expect(component.formRegistro.get('rut')).toBeDefined();
    expect(component.formRegistro.get('nombre')).toBeDefined();
    expect(component.formRegistro.get('email')).toBeDefined();
    expect(component.formRegistro.get('password')).toBeDefined();
    expect(component.formRegistro.get('confirmPassword')).toBeDefined();
    expect(component.formRegistro.get('telefono')).toBeDefined();
    expect(component.formRegistro.get('direccionEnvio')).toBeDefined();
  });

   /**
   * Después de cada prueba, se resetea el formulario de registro para mantener un estado limpio.
   * @usageNotes Llama automáticamente después de cada prueba para restablecer el estado del formulario de registro.
   * @return {void}
   */

  afterEach(() => {
    component.formRegistro.reset();
  });

  /**
   * Prueba unitaria para verificar que las contraseñas coincidan.
   * @description Verifica que el formulario requiera que las contraseñas coincidan correctamente.
   * @param {FormGroup} form - El FormGroup que contiene los campos de contraseña y confirmación de contraseña.
   * @return {void}
   */


  it('Debería requerir que las contraseñas coincidan', () => {
    const form = component.formRegistro;
    if (form !== null && form !== undefined) {
      form.patchValue({
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!'
      });
  
      expect(form.valid).toBeFalsy();
      expect(form.hasError('passwordMismatch')).toBeTruthy();
    }
  });

  /**
   * Prueba unitaria para verificar que se requiera al menos una letra mayúscula en la contraseña.
   * @description Verifica que el formulario requiera al menos una letra mayúscula en la contraseña.
   * @param {FormGroup} form - El FormGroup que contiene el campo de contraseña.
   * @return {void}
   */

  it('Debería requerir al menos una letra mayúscula en la contraseña', () => {
    const form = component.formRegistro;
    if (form !== null && form !== undefined) {
      form.patchValue({
        password: 'password123!',
      });
  
      expect(form.valid).toBeFalsy();
      expect(form.get('password')?.hasError('missingUppercase')).toBeTruthy();
    }
  });

   /**
   * Prueba unitaria para verificar que se requiera al menos una letra minúscula en la contraseña.
   * @description Verifica que el formulario requiera al menos una letra minúscula en la contraseña.
   * @param {FormGroup} form - El FormGroup que contiene el campo de contraseña.
   * @return {void}
   */

  it('Debería requerir al menos una letra minúscula en la contraseña', () => {
    const form = component.formRegistro;
    if (form !== null && form !== undefined) {
      form.patchValue({
        password: 'PASSWORD123!',
      });
  
      expect(form.valid).toBeFalsy();
      expect(form.get('password')?.hasError('missingLowercase')).toBeTruthy();
    }
  });

  /**
   * Prueba unitaria para verificar que se requiera al menos un número en la contraseña.
   * @description Verifica que el formulario requiera al menos un número en la contraseña.
   * @param {FormGroup} form - El FormGroup que contiene el campo de contraseña.
   * @return {void}
   */

  it('Debería requerir al menos un número en la contraseña', () => {
    const form = component.formRegistro;
    if (form !== null && form !== undefined) {
      form.patchValue({
        password: 'Password!',
      });
  
      expect(form.valid).toBeFalsy();
      expect(form.get('password')?.hasError('missingNumber')).toBeTruthy();
    }
  });

});