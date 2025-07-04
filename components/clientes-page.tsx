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
import { Trash2, Plus, Minus, Edit, UserPlus, FileText, Calendar } from "lucide-react"
import type { Cliente } from "@/app/page"

interface ClientesPageProps {
	clientes: Cliente[]
	setClientes: (clientes: Cliente[]) => void
}

export default function ClientesPage({ clientes, setClientes }: ClientesPageProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
	const [formData, setFormData] = useState({
		nome: "",
		nomeSocial: "",
		dataNascimento: "",
		telefones: [""],
		endereco: {
			rua: "",
			numero: "",
			bairro: "",
			cidade: "",
			cep: "",
		},
		documentos: [
			{
				id: "",
				tipo: "RG" as const,
				numero: "",
				dataEmissao: "",
				outroTipo: "",
			},
		],
		tipo: "titular" as "titular" | "dependente",
		titularId: "",
	})

	const titulares = clientes.filter((c) => c.tipo === "titular")

	const resetForm = () => {
		setFormData({
			nome: "",
			nomeSocial: "",
			dataNascimento: "",
			telefones: [""],
			endereco: {
				rua: "",
				numero: "",
				bairro: "",
				cidade: "",
				cep: "",
			},
			documentos: [
				{
					id: "",
					tipo: "RG",
					numero: "",
					dataEmissao: "",
					outroTipo: "",
				},
			],
			tipo: "titular",
			titularId: "",
		})
		setEditingCliente(null)
	}

	const handleEdit = (cliente: Cliente) => {
		setEditingCliente(cliente)
		setFormData({
			nome: cliente.nome,
			nomeSocial: cliente.nomeSocial || "",
			dataNascimento: cliente.dataNascimento,
			telefones: cliente.telefones.length > 0 ? cliente.telefones : [""],
			endereco: cliente.endereco,
			documentos: cliente.documentos.map((doc) => ({
				...doc,
				outroTipo: doc.outroTipo || "",
			})),
			tipo: cliente.tipo,
			titularId: cliente.titularId || "",
		})
		setIsDialogOpen(true)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const clienteData: Cliente = {
			id: editingCliente ? editingCliente.id : Date.now().toString(),
			nome: formData.nome,
			nomeSocial: formData.nomeSocial || undefined,
			dataNascimento: formData.dataNascimento,
			telefones: formData.telefones.filter((t) => t.trim() !== ""),
			endereco: formData.endereco,
			documentos: formData.documentos
				.filter((doc) => doc.numero.trim() !== "")
				.map((doc) => ({
					id: doc.id || Date.now().toString() + Math.random().toString(),
					tipo: doc.tipo,
					numero: doc.numero,
					dataEmissao: doc.dataEmissao,
					outroTipo: doc.tipo === "Outro" ? doc.outroTipo : undefined,
				})),
			tipo: formData.tipo,
			titularId: formData.titularId || undefined,
		}

		if (formData.tipo === "dependente" && formData.titularId) {
			const titular = clientes.find((c) => c.id === formData.titularId)
			if (titular) {
				clienteData.telefones = titular.telefones
				clienteData.endereco = titular.endereco
			}
		}

		if (editingCliente) {
			setClientes(clientes.map((c) => (c.id === editingCliente.id ? clienteData : c)))
		} else {
			setClientes([...clientes, clienteData])
		}

		resetForm()
		setIsDialogOpen(false)
	}

	const adicionarTelefone = () => {
		setFormData({
			...formData,
			telefones: [...formData.telefones, ""],
		})
	}

	const removerTelefone = (index: number) => {
		const novosTelefones = formData.telefones.filter((_, i) => i !== index)
		setFormData({
			...formData,
			telefones: novosTelefones.length > 0 ? novosTelefones : [""],
		})
	}

	const atualizarTelefone = (index: number, valor: string) => {
		const novosTelefones = [...formData.telefones]
		novosTelefones[index] = valor
		setFormData({
			...formData,
			telefones: novosTelefones,
		})
	}

	const adicionarDocumento = () => {
		setFormData({
			...formData,
			documentos: [
				...formData.documentos,
				{
					id: "",
					tipo: "RG",
					numero: "",
					dataEmissao: "",
					outroTipo: "",
				},
			],
		})
	}

	const removerDocumento = (index: number) => {
		const novosDocumentos = formData.documentos.filter((_, i) => i !== index)
		setFormData({
			...formData,
			documentos:
				novosDocumentos.length > 0
					? novosDocumentos
					: [
						{
							id: "",
							tipo: "RG",
							numero: "",
							dataEmissao: "",
							outroTipo: "",
						},
					],
		})
	}

	const atualizarDocumento = (index: number, campo: string, valor: string) => {
		const novosDocumentos = [...formData.documentos]
		novosDocumentos[index] = { ...novosDocumentos[index], [campo]: valor }
		setFormData({
			...formData,
			documentos: novosDocumentos,
		})
	}

	const removerCliente = (id: string) => {
		setClientes(clientes.filter((c) => c.id !== id))
	}

	const calcularIdade = (dataNascimento: string) => {
		const hoje = new Date()
		const nascimento = new Date(dataNascimento)
		let idade = hoje.getFullYear() - nascimento.getFullYear()
		const mes = hoje.getMonth() - nascimento.getMonth()
		if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
			idade--
		}
		return idade
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h2 className="text-xl font-semibold text-white">Lista de Clientes</h2>
					<p className="text-gray-400">Total: {clientes.length} clientes</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
							<UserPlus className="h-4 w-4 mr-2" />
							Novo Cliente
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[90vh] overflow-y-auto mx-auto fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
						<DialogHeader>
							<DialogTitle>{editingCliente ? "Editar Cliente" : "Cadastrar Novo Cliente"}</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="nome">Nome Completo</Label>
									<Input
										id="nome"
										value={formData.nome}
										onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="nomeSocial">Nome Social (Opcional)</Label>
									<Input
										id="nomeSocial"
										value={formData.nomeSocial}
										onChange={(e) => setFormData({ ...formData, nomeSocial: e.target.value })}
										placeholder="Como prefere ser chamado(a)"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="dataNascimento">Data de Nascimento</Label>
									<Input
										id="dataNascimento"
										type="date"
										value={formData.dataNascimento}
										onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="tipo">Tipo de Cliente</Label>
									<Select
										value={formData.tipo}
										onValueChange={(value: "titular" | "dependente") => setFormData({ ...formData, tipo: value })}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="titular">Titular</SelectItem>
											<SelectItem value="dependente">Dependente</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{formData.tipo === "dependente" && (
								<div className="space-y-2">
									<Label htmlFor="titular">Titular Responsável</Label>
									<Select
										value={formData.titularId}
										onValueChange={(value) => setFormData({ ...formData, titularId: value })}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o titular" />
										</SelectTrigger>
										<SelectContent>
											{titulares.map((titular) => (
												<SelectItem key={titular.id} value={titular.id}>
													{titular.nome}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label>Telefones</Label>
									<Button type="button" variant="outline" size="sm" onClick={adicionarTelefone}>
										<Plus className="h-4 w-4 mr-2" />
										Adicionar
									</Button>
								</div>
								{formData.telefones.map((telefone, index) => (
									<div key={index} className="flex gap-2">
										<Input
											value={telefone}
											onChange={(e) => atualizarTelefone(index, e.target.value)}
											placeholder="(00) 00000-0000"
											disabled={formData.tipo === "dependente"}
										/>
										{formData.telefones.length > 1 && formData.tipo === "titular" && (
											<Button type="button" variant="outline" size="icon" onClick={() => removerTelefone(index)}>
												<Minus className="h-4 w-4" />
											</Button>
										)}
									</div>
								))}
								{formData.tipo === "dependente" && (
									<p className="text-sm text-gray-500">Dependentes herdam os telefones do titular</p>
								)}
							</div>

							<div className="space-y-4">
								<Label className="text-base font-semibold">Endereço</Label>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="rua">Rua</Label>
										<Input
											id="rua"
											value={formData.endereco.rua}
											onChange={(e) =>
												setFormData({
													...formData,
													endereco: { ...formData.endereco, rua: e.target.value },
												})
											}
											disabled={formData.tipo === "dependente"}
											required={formData.tipo === "titular"}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="numero">Número</Label>
										<Input
											id="numero"
											value={formData.endereco.numero}
											onChange={(e) =>
												setFormData({
													...formData,
													endereco: { ...formData.endereco, numero: e.target.value },
												})
											}
											disabled={formData.tipo === "dependente"}
											required={formData.tipo === "titular"}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="bairro">Bairro</Label>
										<Input
											id="bairro"
											value={formData.endereco.bairro}
											onChange={(e) =>
												setFormData({
													...formData,
													endereco: { ...formData.endereco, bairro: e.target.value },
												})
											}
											disabled={formData.tipo === "dependente"}
											required={formData.tipo === "titular"}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="cidade">Cidade</Label>
										<Input
											id="cidade"
											value={formData.endereco.cidade}
											onChange={(e) =>
												setFormData({
													...formData,
													endereco: { ...formData.endereco, cidade: e.target.value },
												})
											}
											disabled={formData.tipo === "dependente"}
											required={formData.tipo === "titular"}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="cep">CEP</Label>
										<Input
											id="cep"
											value={formData.endereco.cep}
											onChange={(e) =>
												setFormData({
													...formData,
													endereco: { ...formData.endereco, cep: e.target.value },
												})
											}
											disabled={formData.tipo === "dependente"}
											required={formData.tipo === "titular"}
										/>
									</div>
								</div>
								{formData.tipo === "dependente" && (
									<p className="text-sm text-gray-500">Dependentes herdam o endereço do titular</p>
								)}
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base font-semibold">Documentos</Label>
									<Button type="button" variant="outline" size="sm" onClick={adicionarDocumento}>
										<Plus className="h-4 w-4 mr-2" />
										Adicionar Documento
									</Button>
								</div>
								{formData.documentos.map((documento, index) => (
									<Card key={index} className="p-4 bg-white border-gray-300">
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
											<div className="space-y-2">
												<Label>Tipo de Documento</Label>
												<Select
													value={documento.tipo}
													onValueChange={(value) => atualizarDocumento(index, "tipo", value)}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="RG">RG</SelectItem>
														<SelectItem value="CPF">CPF</SelectItem>
														<SelectItem value="Passaporte">Passaporte</SelectItem>
														<SelectItem value="CNH">CNH</SelectItem>
														<SelectItem value="Outro">Outro</SelectItem>
													</SelectContent>
												</Select>
											</div>

											{documento.tipo === "Outro" && (
												<div className="space-y-2">
													<Label>Especificar Tipo</Label>
													<Input
														value={documento.outroTipo}
														onChange={(e) => atualizarDocumento(index, "outroTipo", e.target.value)}
														placeholder="Ex: OAB, CRM, etc."
													/>
												</div>
											)}

											<div className="space-y-2">
												<Label>Número do Documento</Label>
												<Input
													value={documento.numero}
													onChange={(e) => atualizarDocumento(index, "numero", e.target.value)}
													placeholder="Número do documento"
												/>
											</div>

											<div className="space-y-2">
												<Label>Data de Emissão</Label>
												<Input
													type="date"
													value={documento.dataEmissao}
													onChange={(e) => atualizarDocumento(index, "dataEmissao", e.target.value)}
												/>
											</div>

											{formData.documentos.length > 1 && (
												<div className="flex items-end">
													<Button
														type="button"
														variant="destructive"
														size="icon"
														onClick={() => removerDocumento(index)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											)}
										</div>
									</Card>
								))}
							</div>

							<div className="flex gap-3">
								<Button type="submit" className="flex-1">
									{editingCliente ? "Atualizar Cliente" : "Cadastrar Cliente"}
								</Button>
								<Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
									Cancelar
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
				{clientes.length === 0 ? (
					<Card className="bg-gray-800 border-gray-700">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<div className="text-gray-500 mb-4">
								<UserPlus className="h-12 w-12" />
							</div>
							<h3 className="text-lg font-medium text-white mb-2">Nenhum cliente cadastrado</h3>
							<p className="text-gray-400 text-center mb-4">
								Comece cadastrando seu primeiro cliente para gerenciar hospedagens.
							</p>
							<Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
								<UserPlus className="h-4 w-4 mr-2" />
								Cadastrar Primeiro Cliente
							</Button>
						</CardContent>
					</Card>
				) : (
					clientes.map((cliente) => (
						<Card key={cliente.id} className="bg-gray-800 border-gray-700 hover:shadow-md transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<div>
									<CardTitle className="text-lg text-white">{cliente.nome}</CardTitle>
									{cliente.nomeSocial && (
										<p className="text-sm text-gray-400 mt-1">Nome social: {cliente.nomeSocial}</p>
									)}
									<div className="flex gap-2 mt-2">
										<Badge variant={cliente.tipo === "titular" ? "default" : "secondary"}>{cliente.tipo}</Badge>
										<Badge variant="outline" className="flex items-center gap-1 text-white border-gray-600">
											<Calendar className="h-3 w-3" />
											{calcularIdade(cliente.dataNascimento)} anos
										</Badge>
										{cliente.tipo === "dependente" && cliente.titularId && (
											<Badge variant="outline" className="text-white border-gray-600">
												Titular: {clientes.find((c) => c.id === cliente.titularId)?.nome}
											</Badge>
										)}
									</div>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" size="icon" onClick={() => handleEdit(cliente)}>
										<Edit className="h-4 w-4" />
									</Button>
									<Button variant="destructive" size="icon" onClick={() => removerCliente(cliente.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-3 text-sm">
									<div>
										<strong className="text-gray-300">Data de Nascimento:</strong>
										<div className="ml-2 text-gray-400">
											{new Date(cliente.dataNascimento).toLocaleDateString("pt-BR")}
										</div>
									</div>

									<div>
										<strong className="text-gray-300">Telefones:</strong>
										<div className="ml-2 text-gray-400">
											{cliente.telefones.map((tel, idx) => (
												<div key={idx}>{tel}</div>
											))}
										</div>
									</div>

									<div>
										<strong className="text-gray-300">Endereço:</strong>
										<div className="ml-2 text-gray-400">
											{cliente.endereco.rua}, {cliente.endereco.numero}
											<br />
											{cliente.endereco.bairro} - {cliente.endereco.cidade}
											<br />
											CEP: {cliente.endereco.cep}
										</div>
									</div>

									<div>
										<strong className="text-gray-300 flex items-center gap-1">
											<FileText className="h-3 w-3" />
											Documentos:
										</strong>
										<div className="ml-2 text-gray-400 space-y-1">
											{cliente.documentos.map((doc, idx) => (
												<div key={idx} className="flex justify-between items-center">
													<span>
														{doc.tipo === "Outro" ? doc.outroTipo : doc.tipo}: {doc.numero}
													</span>
													<span className="text-xs text-gray-500">
														{new Date(doc.dataEmissao).toLocaleDateString("pt-BR")}
													</span>
												</div>
											))}
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
