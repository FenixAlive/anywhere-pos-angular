import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  language:'EN' | 'ES' = 'EN';

  private menu ={
    'menu.sell':{
      EN: 'Sell',
      ES: 'Vender'
    },
    'menu.inventory':{
      EN: 'Inventory',
      ES: 'Inventario'
    },
    'menu.catalogs':{
      EN: 'Catalogs',
      ES: 'Catálogos'},
    'menu.reports':{
      EN: 'Reports',
      ES: 'Reportes'},
    'menu.settings':{
      EN: 'Settings',
      ES: 'Configuración'},
    'menu.signout':{
      EN: 'Sign Out',
      ES: 'Cerrar Sesión'},
    'menu.signin':{
      EN: 'Sign In',
      ES: 'Iniciar Sesión'},
    'menu.purchase':{
      EN: 'Purchase',
      ES: 'Compra'},
    'menu.entry':{
      EN: 'Entry',
      ES: 'Entrada'},
    'menu.output':{
      EN: 'Output',
      ES: 'Salida'},
    'menu.articles':{
      EN: 'Articles',
      ES: 'Artículos'},
    'menu.clients':{
      EN: 'Clients',
      ES: 'Clientes'},
    'menu.suppliers':{
      EN: 'Suppliers',
      ES: 'Proveedores'},
    'menu.todo':{
        EN: 'To Do',
        ES: 'Pendientes'},
  }

  private welcome = {
    'welcome.title':{
      EN: 'Welcome to',
      ES: 'Bienvenido a'},
  }

  private dictionary: any = {
    ...this.menu,
    ...this.welcome
  }
    
  constructor() { }

  byId(id: string){
    return this.dictionary?.[id]?.[this.language] ?? ''
  }
}
