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
import { Article, Client, Entry, Output, Profile, Sale, Supplier } from '../models/supabase.model'
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

  postOutput(output: Output) {
    return this.supabase.from('outputs').insert(output)
  }

  postSale(sale: Sale) {
    return this.supabase.from('sales').insert(sale)
  }

  postEntry(entry: Entry) {
    return this.supabase.from('entries').insert(entry)
  }

  postSupplier(supplier: Supplier) {
    return this.supabase.from('suppliers').insert(supplier)
  }

  postClient(client: Client) {
    return this.supabase.from('clients').insert(client)
  }
}