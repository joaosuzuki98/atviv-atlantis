"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import ClientesPage from "@/components/clientes-page"
import AcomodacoesPage from "@/components/acomodacoes-page"
import HospedagensPage from "@/components/hospedagens-page"
import Dashboard from "@/components/dashboard"

export interface Documento {
	id: string
	tipo: "RG" | "CPF" | "Passaporte" | "CNH" | "Outro"
	numero: string
	dataEmissao: string
	outroTipo?: string
}

export interface Cliente {
	id: string
	nome: string
	nomeSocial?: string
	dataNascimento: string
	telefones: string[]
	endereco: {
		rua: string
		numero: string
		bairro: string
		cidade: string
		cep: string
	}
	documentos: Documento[]
	tipo: "titular" | "dependente"
	titularId?: string
}

export interface Acomodacao {
	id: string
	nomePacote: string
	vagasGaragem: number
	camasSolteiro: number
	camasCasal: number
	climatizacao: boolean
	numeroSuites: number
}

export interface Hospedagem {
	id: string
	clienteId: string
	acomodacaoId: string
	dataInicio: string
	dataFim: string
}

export default function Home() {
	const [activeTab, setActiveTab] = useState("dashboard")
	const [clientes, setClientes] = useState<Cliente[]>([
		{
			id: "1",
			nome: "João Silva Santos",
			nomeSocial: "João Santos",
			dataNascimento: "1985-03-15",
			telefones: ["(11) 99999-1234", "(11) 3333-5678"],
			endereco: {
				rua: "Rua das Flores",
				numero: "123",
				bairro: "Centro",
				cidade: "São Paulo",
				cep: "01234-567",
			},
			documentos: [
				{
					id: "1",
					tipo: "RG",
					numero: "12.345.678-9",
					dataEmissao: "2020-01-15",
				},
				{
					id: "2",
					tipo: "CPF",
					numero: "123.456.789-00",
					dataEmissao: "2018-05-20",
				},
				{
					id: "3",
					tipo: "Passaporte",
					numero: "BR123456",
					dataEmissao: "2022-08-10",
				},
			],
			tipo: "titular",
		},
		{
			id: "2",
			nome: "Maria Oliveira Costa",
			dataNascimento: "1990-07-22",
			telefones: ["(21) 88888-9876", "(21) 2222-1111"],
			endereco: {
				rua: "Avenida Copacabana",
				numero: "456",
				bairro: "Copacabana",
				cidade: "Rio de Janeiro",
				cep: "22070-001",
			},
			documentos: [
				{
					id: "4",
					tipo: "RG",
					numero: "98.765.432-1",
					dataEmissao: "2019-03-12",
				},
				{
					id: "5",
					tipo: "CPF",
					numero: "987.654.321-00",
					dataEmissao: "2017-11-08",
				}
			],
			tipo: "titular",
		},
		{
			id: "3",
			nome: "Pedro Silva Santos",
			dataNascimento: "2010-12-03",
			telefones: ["(11) 99999-1234", "(11) 3333-5678"],
			endereco: {
				rua: "Rua das Flores",
				numero: "123",
				bairro: "Centro",
				cidade: "São Paulo",
				cep: "01234-567",
			},
			documentos: [
				{
					id: "7",
					tipo: "RG",
					numero: "11.222.333-4",
					dataEmissao: "2023-01-10",
				},
				{
					id: "8",
					tipo: "CPF",
					numero: "111.222.333-44",
					dataEmissao: "2023-01-10",
				},
			],
			tipo: "dependente",
			titularId: "1",
		},
		{
			id: "4",
			nome: "Ana Carolina Ferreira",
			nomeSocial: "Carol Ferreira",
			dataNascimento: "1988-11-30",
			telefones: ["(31) 77777-5555"],
			endereco: {
				rua: "Rua da Liberdade",
				numero: "789",
				bairro: "Savassi",
				cidade: "Belo Horizonte",
				cep: "30112-000",
			},
			documentos: [
				{
					id: "9",
					tipo: "RG",
					numero: "55.666.777-8",
					dataEmissao: "2020-09-25",
				},
				{
					id: "10",
					tipo: "CPF",
					numero: "555.666.777-88",
					dataEmissao: "2018-04-12",
				},
				{
					id: "11",
					tipo: "Passaporte",
					numero: "BR789012",
					dataEmissao: "2023-02-18",
				}
			],
			tipo: "titular",
		},
		{
			id: "5",
			nome: "Carlos Eduardo Lima",
			dataNascimento: "1975-05-18",
			telefones: ["(85) 66666-4444"],
			endereco: {
				rua: "Avenida Beira Mar",
				numero: "321",
				bairro: "Meireles",
				cidade: "Fortaleza",
				cep: "60165-121",
			},
			documentos: [
				{
					id: "13",
					tipo: "RG",
					numero: "33.444.555-6",
					dataEmissao: "2018-12-05",
				},
				{
					id: "14",
					tipo: "CPF",
					numero: "333.444.555-66",
					dataEmissao: "2016-08-22",
				},
			],
			tipo: "titular",
		},
	])

	const [acomodacoes, setAcomodacoes] = useState<Acomodacao[]>([
		{
			id: "1",
			nomePacote: "Suíte Master Oceânica",
			vagasGaragem: 2,
			camasSolteiro: 0,
			camasCasal: 1,
			climatizacao: true,
			numeroSuites: 1,
		},
		{
			id: "2",
			nomePacote: "Apartamento Família Premium",
			vagasGaragem: 1,
			camasSolteiro: 2,
			camasCasal: 1,
			climatizacao: true,
			numeroSuites: 2,
		},
		{
			id: "3",
			nomePacote: "Quarto Standard",
			vagasGaragem: 1,
			camasSolteiro: 2,
			camasCasal: 0,
			climatizacao: false,
			numeroSuites: 0,
		},
		{
			id: "4",
			nomePacote: "Suíte Executiva",
			vagasGaragem: 1,
			camasSolteiro: 0,
			camasCasal: 1,
			climatizacao: true,
			numeroSuites: 1,
		},
		{
			id: "5",
			nomePacote: "Apartamento Luxo Vista Mar",
			vagasGaragem: 2,
			camasSolteiro: 1,
			camasCasal: 2,
			climatizacao: true,
			numeroSuites: 3,
		},
		{
			id: "6",
			nomePacote: "Quarto Econômico",
			vagasGaragem: 0,
			camasSolteiro: 1,
			camasCasal: 0,
			climatizacao: false,
			numeroSuites: 0,
		},
	])

	const [hospedagens, setHospedagens] = useState<Hospedagem[]>([
		{
			id: "1",
			clienteId: "1",
			acomodacaoId: "1",
			dataInicio: "2024-01-15",
			dataFim: "2024-01-20",
		},
		{
			id: "2",
			clienteId: "2",
			acomodacaoId: "2",
			dataInicio: "2024-02-10",
			dataFim: "2024-02-17",
		},
		{
			id: "3",
			clienteId: "4",
			acomodacaoId: "4",
			dataInicio: "2024-03-05",
			dataFim: "2024-03-12",
		},
		{
			id: "4",
			clienteId: "5",
			acomodacaoId: "3",
			dataInicio: "2024-01-25",
			dataFim: "2024-01-30",
		},
		{
			id: "5",
			clienteId: "1",
			acomodacaoId: "5",
			dataInicio: "2024-12-20",
			dataFim: "2024-12-27",
		},
		{
			id: "6",
			clienteId: "2",
			acomodacaoId: "1",
			dataInicio: "2024-12-15",
			dataFim: "2024-12-22",
		},
	])

	const renderContent = () => {
		switch (activeTab) {
			case "dashboard":
				return <Dashboard clientes={clientes} acomodacoes={acomodacoes} hospedagens={hospedagens} />
			case "clientes":
				return <ClientesPage clientes={clientes} setClientes={setClientes} />
			case "acomodacoes":
				return <AcomodacoesPage acomodacoes={acomodacoes} setAcomodacoes={setAcomodacoes} />
			case "hospedagens":
				return (
					<HospedagensPage
						hospedagens={hospedagens}
						setHospedagens={setHospedagens}
						clientes={clientes}
						acomodacoes={acomodacoes}
					/>
				)
			default:
				return <Dashboard clientes={clientes} acomodacoes={acomodacoes} hospedagens={hospedagens} />
		}
	}

	return (
		<div className="flex flex-col lg:flex-row h-screen bg-gray-900">
			<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header activeTab={activeTab} />
				<main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-900">{renderContent()}</main>
			</div>
		</div>
	)
}
