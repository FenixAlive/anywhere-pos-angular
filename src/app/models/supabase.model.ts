import { FormGroup } from "@angular/forms"

export interface Profile {
    id?: string
    username: string
    website: string
    avatar_url: string
}

export interface Article {
    id?: number
    created_at?: Date
    name?: string
    identifier_code?: string
    price_1?: number
    price_2?: number
    price_3?: number
    discount_amount?: number
    discount_percentage?: number
    user_id?: string
    tax_1_percentage?: number
    tax_2_percentage?: number
    tax_3_percentage?: number
    description?: string
    quantity?: number
    cost?: number
}

export interface RegistryModel {
    id?: number
    created_at?: Date
    updated_at?: Date
    user_id?: string
    description?: string
    quantity?: number
    price?: number
    subtotal?: number
    discount?: number
    tax_1?: number
    tax_2?: number
    tax_3?: number
    total?: number
    article_id?: number
}

export interface Entry extends RegistryModel{
    type?: 'purchase' | 'adjustment'
    purchase_id?: number
}

export interface Output extends RegistryModel{
    type?: 'sale' | 'adjustment'
    sale_id?: number
}

export interface MultipleMovement{
    id?: number
    created_at?: Date
    subtotal?: number
    discount?: number
    tax_1?: number
    tax_2?: number
    tax_3?: number
    total?: number
}
export interface Purchase extends MultipleMovement{
    supplier_id?: number
}


export interface Sale extends MultipleMovement{
    client_id?: number
}

export interface ContactPerson{
    id?: number
    created_at?: Date
    updated_at?: Date
    user_id?: string
    name?: string
    address?: string
    phone?: string
    email?: string
    notes?: string
}

export interface Client extends ContactPerson{   
}

export interface Supplier extends ContactPerson{
}

export interface Todo {
 id?: number
 created_at?: Date
 todo: string
 done: boolean
}

export interface TaxName{
    id?: number
    created_at?: Date
    tax_type: 'tax_1' | 'tax_2' | 'tax_3'
    tax_name: string
}

