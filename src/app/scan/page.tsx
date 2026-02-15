
"use client"

import { ScanLine } from 'lucide-react'

export default function ScanPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-4">
            <div className="bg-granite-100 p-8 rounded-full text-granite-600 animate-pulse">
                <ScanLine className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold text-granite-800">Escanear Código QR</h1>
            <p className="text-granite-500 max-w-xs">
                Escanea el código QR de otro usuario para enviarle Sabadolares o recibir puntos.
            </p>
        </div>
    )
}
