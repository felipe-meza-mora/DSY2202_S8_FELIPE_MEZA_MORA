import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})

/**
 * Componente para la gestión de ventas y pedidos.
 * @description Este componente muestra la lista de pedidos y permite actualizar su estado.
 */

export class SalesComponent implements OnInit {

  /**
   * Arreglo que contiene todos los pedidos.
   * @type {any[]} Arreglo de objetos que representan los pedidos almacenados.
   */
  pedidos: any[] = [];

  /**
   * Objeto que representa al usuario actual.
   * @type {any} Objeto que contiene la información del usuario actualmente autenticado.
   */
  usuario: any = null;

  /**
   * String que indica los permisos del usuario.
   * @type {string} String que describe los permisos del usuario actual.
   */
  permisos: string = '';

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene los datos del usuario y los pedidos del almacenamiento local.
   */

  ngOnInit() {
    // Obtener el usuario del local storage
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuario = JSON.parse(usuarioStorage);
      this.permisos = this.usuario.permisos;
    }

    // Obtener los pedidos del local storage
    const pedidosStorage = localStorage.getItem('pedidos');
    if (pedidosStorage) {
      this.pedidos = JSON.parse(pedidosStorage);
    }
  }

  /**
   * Método para actualizar el estado de un pedido.
   * @param pedido El pedido que se desea actualizar.
   * @param nuevoEstado El nuevo estado que se asignará al pedido.
   */
  actualizarEstado(pedido: any, nuevoEstado: string) {
    pedido.estado = nuevoEstado;
    // Actualizar en el local storage
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
  }
}