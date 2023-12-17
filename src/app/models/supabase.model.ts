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

export interface Entry {
    id?: number
    created_at?: Date
    updated_at?: Date
    user_id?: string
    description?: string
    type?: 'purchase' | 'adjustment'
    quantity?: number
    price?: number
    subtotal?: number
    discount?: number
    tax_1?: number
    tax_2?: number
    tax_3?: number
    total?: number
    article_id?: number
    purchase_id?: number
}

export interface Purchase {
    id?: number
    created_at?: Date
    subtotal?: number
    discount?: number
    tax_1?: number
    tax_2?: number
    tax_3?: number
    total?: number
    supplier_id?: number
}

export interface Output {
    id?: number
    created_at?: Date
    updated_at?: Date
    user_id?: string
    description?: string
    type?: 'sale' | 'adjustment'
    quantity?: number
    price?: number
    subtotal?: number
    discount?: number
    tax_1?: number
    tax_2?: number
    tax_3?: number
    total?: number
    article_id?: number
    sale_id?: number
}

export interface Sale {
    id?: number
    created_at?: Date
    subtotal?: number
    discount?: number
    tax_1?: number
    tax_2?: number
    tax_3?: number
    total?: number
    client_id?: number
}

export interface Client {
    id?: number
    created_at?: Date
    updated_at?: Date
    user_id?: string
    name?: string
    notes?: string
    address?: string
    phone?: string
    email?: string
}

export interface Supplier {
    id?: number
    created_at?: Date
    updated_at?: Date
    name?: string
    address?: string
    phone?: string
    email?: string
    notes?: string
    user_id?: string
}

