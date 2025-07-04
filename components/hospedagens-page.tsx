"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Calendar, User, Building, Edit, Plus } from "lucide-react"
import type { Cliente, Acomodacao, Hospedagem } from "@/app/page"

interface HospedagensPageProps {
	hospedagens: Hospedagem[]
	setHospedagens: (hospedagens: Hospedagem[]) => void
	clientes: Cliente[]
	acomodacoes: Acomodacao[]
}

export default function HospedagensPage({ hospedagens, setHospedagens, clientes, acomodacoes }: HospedagensPageProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingHospedagem, setEditingHospedagem] = useState<Hospedagem | null>(null)
	const [formData, setFormData] = useState({
		clienteId: "",
		acomodacaoId: "",
		dataInicio: "",
		dataFim: "",
	})

	const resetForm = () => {
		setFormData({
			clienteId: "",
			acomodacaoId: "",
			dataInicio: "",
			dataFim: "",
		})
		setEditingHospedagem(null)
	}

	const handleEdit = (hospedagem: Hospedagem) => {
		setEditingHospedagem(hospedagem)
		setFormData({
			clienteId: hospedagem.clienteId,
			acomodacaoId: hospedagem.acomodacaoId,
			dataInicio: hospedagem.dataInicio,
			dataFim: hospedagem.dataFim,
		})
		setIsDialogOpen(true)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const hospedagemData: Hospedagem = {
			id: editingHospedagem ? editingHospedagem.id : Date.now().toString(),
			...formData,
		}

		if (editingHospedagem) {
			setHospedagens(hospedagens.map((h) => (h.id === editingHospedagem.id ? hospedagemData : h)))
		} else {
			setHospedagens([...hospedagens, hospedagemData])
		}

		resetForm()
		setIsDialogOpen(false)
	}

	const removerHospedagem = (id: string) => {
		setHospedagens(hospedagens.filter((h) => h.id !== id))
	}

	const getClienteNome = (clienteId: string) => {
		const cliente = clientes.find((c) => c.id === clienteId)
		return cliente ? cliente.nome : "Cliente não encontrado"
	}

	const getAcomodacaoNome = (acomodacaoId: string) => {
		const acomodacao = acomodacoes.find((a) => a.id === acomodacaoId)
		return acomodacao ? acomodacao.nomePacote : "Acomodação não encontrada"
	}

	const formatarData = (data: string) => {
		return new Date(data).toLocaleDateString("pt-BR")
	}

	const calcularDias = (inicio: string, fim: string) => {
		const dataInicio = new Date(inicio)
		const dataFim = new Date(fim)
		const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		return diffDays
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-xl font-semibold text-white">Lista de Hospedagens</h2>
					<p className="text-gray-400">Total: {hospedagens.length} hospedagens</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={resetForm} className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
							<Plus className="h-4 w-4 mr-2" />
							Nova Hospedagem
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-[95vw] sm:max-w-2xl mx-auto fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
						<DialogHeader>
							<DialogTitle>{editingHospedagem ? "Editar Hospedagem" : "Cadastrar Nova Hospedagem"}</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="cliente">Cliente</Label>
									<Select
										value={formData.clienteId}
										onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione um cliente" />
										</SelectTrigger>
										<SelectContent>
											{clientes.map((cliente) => (
												<SelectItem key={cliente.id} value={cliente.id}>
													{cliente.nome} ({cliente.tipo})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="acomodacao">Acomodação</Label>
									<Select
										value={formData.acomodacaoId}
										onValueChange={(value) => setFormData({ ...formData, acomodacaoId: value })}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione uma acomodação" />
										</SelectTrigger>
										<SelectContent>
											{acomodacoes.map((acomodacao) => (
												<SelectItem key={acomodacao.id} value={acomodacao.id}>
													{acomodacao.nomePacote}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="dataInicio">Data de Início</Label>
									<Input
										id="dataInicio"
										type="date"
										value={formData.dataInicio}
										onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="dataFim">Data de Fim</Label>
									<Input
										id="dataFim"
										type="date"
										value={formData.dataFim}
										onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
										required
										min={formData.dataInicio}
									/>
								</div>
							</div>

							{formData.dataInicio && formData.dataFim && (
								<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
									<p className="text-sm text-blue-700 font-medium">
										Duração da hospedagem: {calcularDias(formData.dataInicio, formData.dataFim)} dias
									</p>
								</div>
							)}

							<div className="flex gap-3">
								<Button type="submit" className="flex-1" disabled={clientes.length === 0 || acomodacoes.length === 0}>
									{clientes.length === 0 || acomodacoes.length === 0
										? "Cadastre clientes e acomodações primeiro"
										: editingHospedagem
											? "Atualizar Hospedagem"
											: "Cadastrar Hospedagem"}
								</Button>
								<Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
									Cancelar
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="space-y-4">
				{hospedagens.length === 0 ? (
					<Card className="bg-gray-800 border-gray-700">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<div className="text-gray-500 mb-4">
								<Calendar className="h-12 w-12" />
							</div>
							<h3 className="text-lg font-medium text-white mb-2">Nenhuma hospedagem cadastrada</h3>
							<p className="text-gray-400 text-center mb-4">
								Registre hospedagens vinculando clientes às acomodações disponíveis.
							</p>
							<Button
								onClick={() => setIsDialogOpen(true)}
								className="bg-orange-600 hover:bg-orange-700"
								disabled={clientes.length === 0 || acomodacoes.length === 0}
							>
								<Plus className="h-4 w-4 mr-2" />
								{clientes.length === 0 || acomodacoes.length === 0
									? "Cadastre clientes e acomodações primeiro"
									: "Cadastrar Primeira Hospedagem"}
							</Button>
						</CardContent>
					</Card>
				) : (
					hospedagens.map((hospedagem) => (
						<Card key={hospedagem.id} className="bg-gray-800 border-gray-700 hover:shadow-md transition-shadow">
							<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
								<div className="flex flex-col sm:flex-row sm:items-center gap-3">
									<CardTitle className="text-lg text-white">Hospedagem #{hospedagem.id.slice(-4)}</CardTitle>
									<Badge variant={new Date(hospedagem.dataFim) >= new Date() ? "default" : "secondary"}>
										{new Date(hospedagem.dataFim) >= new Date() ? "Ativa" : "Finalizada"}
									</Badge>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" size="icon" onClick={() => handleEdit(hospedagem)}>
										<Edit className="h-4 w-4" />
									</Button>
									<Button variant="destructive" size="icon" onClick={() => removerHospedagem(hospedagem.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									<div className="flex items-center gap-3">
										<User className="h-5 w-5 text-gray-500" />
										<div>
											<p className="font-medium text-white">{getClienteNome(hospedagem.clienteId)}</p>
											<p className="text-sm text-gray-400">Cliente</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<Building className="h-5 w-5 text-gray-500" />
										<div>
											<p className="font-medium text-white">{getAcomodacaoNome(hospedagem.acomodacaoId)}</p>
											<p className="text-sm text-gray-400">Acomodação</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<Calendar className="h-5 w-5 text-gray-500" />
										<div>
											<p className="font-medium text-white">
												{formatarData(hospedagem.dataInicio)} - {formatarData(hospedagem.dataFim)}
											</p>
											<p className="text-sm text-gray-400">
												{calcularDias(hospedagem.dataInicio, hospedagem.dataFim)} dias
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	)
}
