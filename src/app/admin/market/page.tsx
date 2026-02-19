"use client"

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Image as ImageIcon, X, ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

interface ItemForm {
    id?: string
    title: string
    description: string
    price: number
    image_url: string
    category: string
}

export default function AdminMarketPage() {
    const user = useStore((state) => state.user)
    const items = useStore((state) => state.marketItems)
    const setMarketItems = useStore((state) => state.setMarketItems)

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<ItemForm>({
        title: '',
        description: '',
        price: 0,
        image_url: '',
        category: 'physical'
    })

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    if (user.role !== 'admin') {
        return <div className="p-8 text-center bg-white rounded-3xl m-6 shadow-sm border border-slate-100 font-bold text-slate-800">No tienes permisos para ver esta página.</div>
    }

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            price: 0,
            image_url: '',
            category: 'physical'
        })
        setIsEditing(false)
    }

    const handleEdit = (item: any) => {
        setForm(item)
        setIsEditing(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

        setLoading(true)
        const { error } = await supabase.from('items').delete().eq('id', id)

        if (error) {
            alert('Error eliminando: ' + error.message)
        } else {
            setMarketItems(items.filter(i => i.id !== id))
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.church_id) {
            alert('Error: No se pudo identificar tu iglesia. Por favor, intenta cerrar sesión y volver a entrar.')
            return
        }

        setLoading(true)

        try {
            // Clean data for submission
            const submissionData = {
                title: form.title,
                description: form.description,
                price: Number(form.price) || 0,
                image_url: form.image_url,
                category: form.category,
                church_id: user.church_id
            }

            if (isEditing) {
                const { error } = await supabase
                    .from('items')
                    .update(submissionData)
                    .eq('id', form.id)

                if (error) throw error
                setMarketItems(items.map(i => i.id === form.id ? { ...i, ...submissionData } : i))
            } else {
                const { data, error } = await supabase
                    .from('items')
                    .insert([submissionData])
                    .select()

                if (error) throw error

                if (data && data.length > 0) {
                    setMarketItems([data[0], ...items])
                } else {
                    // Fallback: if insert succeeded but no data returned (e.g. RLS)
                    // we might need to rely on the local state or wait for a refetch
                    console.warn('Insert successful but no data returned from select().')
                    // Create a dummy item for local state if necessary or just alert
                    throw new Error('El producto se creó pero no se pudo recuperar la información. Por favor, recarga la página.')
                }
            }
            resetForm()
        } catch (error: any) {
            console.error('Error submitting form:', error)
            alert('Error: ' + (error.message || 'Ocurrió un error inesperado'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="pb-24 pt-6 px-6 max-w-4xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
                <Link href="/" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Link>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestionar Mercado</h1>
            </header>

            {/* Formulario */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-8 -mt-8"></div>

                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    {isEditing ? <Pencil className="w-5 h-5 text-indigo-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                    {isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Título</label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Nombre del producto"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Precio (Sabadolares)</label>
                        <input
                            type="number"
                            required
                            value={form.price}
                            onChange={e => {
                                const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                                setForm({ ...form, price: isNaN(val) ? 0 : val });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                            placeholder="0"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Descripción</label>
                        <textarea
                            required
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            rows={3}
                            placeholder="Detalles sobre el producto..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">URL de Imagen</label>
                        <div className="relative">
                            <input
                                type="url"
                                required
                                value={form.image_url}
                                onChange={e => setForm({ ...form, image_url: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="https://..."
                            />
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Categoría</label>
                        <select
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            <option value="physical">Físico (Sudaderas, tazas...)</option>
                            <option value="event">Evento (Campamentos...)</option>
                            <option value="privilege">Privilegio (Elegir música...)</option>
                            <option value="coupon">Cupón</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isEditing ? <><Save className="w-5 h-5" /> Guardar Cambios</> : <><Plus className="w-5 h-5" /> Crear Producto</>}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 rounded-2xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista de Items */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-slate-300">
                    Catálogo Actual
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-50">
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                                <p className="text-indigo-600 font-black text-lg">{item.price} <span className="text-xs font-bold text-indigo-400">Pts</span></p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
