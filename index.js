import { select, input, checkbox, confirm } from "@inquirer/prompts";

import fs from "node:fs/promises";

let metas;

let mensagem = "Bem Vindo ao App de Metas!";

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8");
        metas = JSON.parse(dados);
    } catch (error) {
        metas = [];
    }
};

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
};

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta" });

    if (meta.length == 0) {
        mensagem = "A meta não pode ser vazia!";
        return;
    }

    const confirmar = await confirm({
        message: "Você deseja cadastrar essa meta ?",
        default: true,
    });

    if (!confirmar) {
        mensagem = "O cadastro da meta foi cancelado pelo usuário";
        return;
    }

    metas.push({
        value: meta,
        checked: false,
    });

    mensagem = "Meta cadastrada com sucesso!";
};

const listarMetas = async () => {
    if (metas.length == 0) {
        mensagem = "Nenhuma meta foi cadastrada!";

        return;
    }

    const respostas = await checkbox({
        message:
            "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    });

    metas.forEach((m) => {
        m.checked = false;
    });

    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada";
        return;
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta;
        });

        meta.checked = true;
    });

    mensagem = "Meta(s) marcada(s) como concluída(s)";
};

const metasRealizadas = async () => {
    if (metas.length == 0) {
        mensagem = "Nenhuma meta foi cadastrada!";

        return;
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked;
    });

    if (realizadas.length == 0) {
        mensagem = "Não existem metas realizadas!";
        return;
    }

    await select({
        message: `Metas Realizadas ${realizadas.length}`,
        choices: [...realizadas],
    });
};

const metasAbertas = async () => {
    if (metas.length == 0) {
        mensagem = "Nenhuma meta foi cadastrada!";

        return;
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true;
    });

    if (abertas.length == 0) {
        mensagem = "Não existem metas abertas!";

        return;
    }

    await select({
        message: `Metas Abertas ${abertas.length}`,
        choices: [...abertas],
    });
};

const atualizarMeta = async () => {
    if (metas.length == 0) {
        mensagem = "Nenhuma meta foi cadastrada!";
        return;
    }

    const metasParaAtualizar = metas.map((meta) => {
        return { value: meta.value, checked: false };
    });

    const metaParaAtualizar = await select({
        message: "Selecione uma meta para atualizar!",
        choices: [...metasParaAtualizar],
    });

    if (!metaParaAtualizar) {
        mensagem = "Nenhum item selecionado!";
        return;
    }

    const novaMeta = await input({ message: "Digite a nova meta!" });

    if (novaMeta.length == 0) {
        mensagem = "O nome da meta não pode ser vazio!";
        return;
    }

    const confirmar = await confirm({
        message: "Você deseja atualizar esta meta ?",

        default: true,
    });

    if (!confirmar) {
        mensagem = "A atualização da meta foi cancelada pelo usuário";
        return;
    }

    metas = metas.map((meta) => {
        if (meta.value == metaParaAtualizar) {
            return { value: novaMeta, checked: false };
        }
        return meta;
    });

    mensagem = "Meta atualizada com sucesso!";
};

const deletarMetas = async () => {
    if (metas.length == 0) {
        mensagem = "Nenhuma meta foi cadastrada!";

        return;
    }

    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false };
    });

    const itemsADeletar = await checkbox({
        message: "Selecione um item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    });

    if (itemsADeletar.length == 0) {
        mensagem = "Nenhuma meta para deletar!";
        return;
    }

    const confirmar = await confirm({
        message: "Você deseja deletar esta(s) meta(s) ?",
        default: true,
    });

    if (!confirmar) {
        mensagem =
            "A exclusão da(s) meta(s) foi(foram) cancelada(s) pelo usuário";
        return;
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item;
        });
    });

    mensagem = "Meta(s) deletada(s) com sucesso!";
};

const mostrarMensagem = () => {
    console.clear();

    if (mensagem != "") {
        console.log(mensagem);
        console.log("");
        mensagem = "";
    }
};

const start = async () => {
    await carregarMetas();

    while (true) {
        mostrarMensagem();
        await salvarMetas();

        const option = await select({
            message: "Menu",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar",
                },
                {
                    name: "Listar metas",
                    value: "listar",
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas",
                },
                {
                    name: "Metas abertas",
                    value: "abertas",
                },

                {
                    name: "Atualizar meta",
                    value: "atualizar",
                },

                {
                    name: "Deletar metas",
                    value: "deletar",
                },
                {
                    name: "Sair",
                    value: "sair",
                },
            ],
        });

        switch (option) {
            case "cadastrar":
                await cadastrarMeta();
                break;

            case "listar":
                await listarMetas();
                break;

            case "realizadas":
                await metasRealizadas();
                break;

            case "abertas":
                await metasAbertas();
                break;

            case "atualizar":
                await atualizarMeta();
                break;

            case "deletar":
                await deletarMetas();
                break;

            case "sair":
                console.log("Até a proxima!");
                return;

            default:
                break;
        }
    }
};

start();
