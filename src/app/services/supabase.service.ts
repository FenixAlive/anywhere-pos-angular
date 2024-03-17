import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '../../../environments/environment'
import { Article, Client, Entry, Output, Preference, Profile, Purchase, Sale, Supplier, TaxName, Todo } from '../models/supabase.model';
import { BehaviorSubject, Subject } from 'rxjs'




@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase!: SupabaseClient
  _session: AuthSession | null = null
  articles = new BehaviorSubject([] as Article[])

  constructor() {
    this.initialize()
  }

  async initialize() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    const resp = await this.getArticles()
    if (resp?.data) {
      this.articles.next(resp.data as Article[])
    }
  }

  get session() {
    if (this.supabase?.auth)
      this.supabase?.auth?.getSession()?.then(({ data }) => {
        this._session = data.session
      })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    if (this.supabase?.auth)
      return this.supabase.auth.onAuthStateChange(callback)
    return
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })

  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  getArticles(term = '') {
    return this.supabase
      .from('articles')
      .select()
      .or(`name.ilike."%${term}%",identifier_code.ilike."%${term}%"`)
  }

  postArticle(article: Article) {
    return this.supabase.from('articles').insert(article)
  }

  updateArticle(article: Article){
    if(!article.id){
      this.postArticle(article)
    }
    return this.supabase.from('articles').update(article).eq('id', article.id)
  }

  deleteArticle(id: number | string){
    return this.supabase.from('articles').delete().eq('id', id)
  }

  updateInventory(amount: number, article: Article){
    article.quantity = (article?.quantity ?? 0 )+ amount
    return this.updateArticle({id: article.id, quantity: article.quantity})
  }

  postOutput(output: Output) {
    return this.supabase.from('outputs').insert(output)
  }

  postSale(sale: Sale) {
    return this.supabase.from('sales').insert(sale)
  }

  postEntry(entry: Entry) {
    return this.supabase.from('entries').insert(entry)
  }

  postPurchase(purchase: Purchase) {
    return this.supabase.from('purchases').insert(purchase)
  }

  postSupplier(supplier: Supplier) {
    return this.supabase.from('suppliers').insert(supplier)
  }

  updateSupplier(supplier: Supplier) {
    return this.supabase.from('suppliers').update(supplier).eq('id', supplier.id)
  }

  deleteSupplier(id: number | string){
    return this.supabase.from('suppliers').delete().eq('id', id)
  }

  postClient(client: Client) {
    return this.supabase.from('clients').insert(client)
  }

  updateClient(client: Client)  {
    return this.supabase.from('clients').update(client).eq('id', client.id)
  }

  deleteClient(id: number | string){
    return this.supabase.from('clients').delete().eq('id', id)
  }

  getTaxNames(){
    return this.supabase.from('tax_names').select()
  }

  postTaxName(tax: TaxName){
    return this.supabase.from('tax_names').insert(tax)
  }

  updateTaxName(tax: TaxName){
    return this.supabase.from('tax_names').update(tax).eq('id', tax.id)
  }

  deleteTaxName(id: number | string){
    return this.supabase.from('tax_names').delete().eq('id', id)
  }


  getTodos(){
    return this.supabase.from('todos').select()
  }

  postTodo(todo: Todo){
    return this.supabase.from('todos').insert(todo)
  }

  updateTodo(todo: Todo){
    return this.supabase.from('todos').update(todo).eq('id', todo.id)
  }

  deleteTodo(id: number | string){
    return this.supabase.from('todos').delete().eq('id', id)
  }

  getPreference(key: string){
    return this.supabase.from('preferences').select().eq('key', key).maybeSingle()
  }

  postPreference(preference: Preference){
    return this.supabase.from('preferences').insert(preference)
  }

  updatePreference(preference: Preference){
    return this.supabase.from('preferences').update(preference).eq('id', preference.id)
  }

  deletePreference(id: number | string){
    return this.supabase.from('preferences').delete().eq('id', id)
  }

  getCustom(tableName: string){
    return this.supabase.from(tableName).select()
  }

}