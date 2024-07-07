import { Injectable } from '@angular/core';
import { User } from '../models/users.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Firestore,collection,addDoc,doc,query,getDocs,where,updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService{
 
   /**
     * Servicio para la gestión de usuarios.
     * Proporciona métodos para agregar, actualizar, y eliminar usuarios en Firestore.
     */
  
  private usersCollection = collection(this.firestore, 'users');
  constructor(private firestore : Firestore) { }

  /**
     * Añade un nuevo usuario a la colección de usuarios en Firestore.
     * @param usuario El usuario que se añadirá a Firestore.
     * @returns Una promesa que se resuelve cuando se completa la operación de añadir el usuario.
     */
  
  addUser(user: User): Promise<void> {
    return addDoc(this.usersCollection, user).then(() => {});
  }

  async isRutRegistered(rut: string): Promise<boolean> {
    const q = query(this.usersCollection, where('rut', '==', rut));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    const q = query(this.usersCollection, where('correo', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const q = query(this.usersCollection, where('correo', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as User;
    }
    return null;
  }


  async updatePassword(email: string, newPassword: string): Promise<void> {
    const q = query(this.usersCollection, where('correo', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(this.firestore, 'users', userDoc.id);
      await updateDoc(userRef, { password: newPassword });
    }
  }

  async updateUser(user: Partial<User>): Promise<void> {
    if (!user.correo) {
      throw new Error('Email is required to update user');
    }

    const q = query(this.usersCollection, where('correo', '==', user.correo));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(this.firestore, 'users', userDoc.id);

      // Filtrar los campos undefined y conservar el tipo Partial<User>
      const userData: Partial<User> = Object.fromEntries(
        Object.entries(user).filter(([_, v]) => v !== undefined)
      ) as Partial<User>;

      await updateDoc(userRef, userData);
    }
  }

}
