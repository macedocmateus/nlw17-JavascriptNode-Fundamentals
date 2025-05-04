import { select, input, checkbox } from "@inquirer/prompts";

let meta = {};

let metas = [meta];

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta" });

    if (meta.length == 0) {
        console.log("A meta não pode ser vazia");
        return;
    }

    metas.push({
        value: meta,
        checked: false,
    });
};

const listarMetas = async () => {
    const respostas = await checkbox({
        message:
            "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    });

    if (respostas.length == 0) {
        console.log("Nenhuma meta selecionada");
        return;
    }

    metas.forEach((m) => {
        m.checked = false;
    });

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta;
        });

        meta.checked = true;
    });

    console.log("Meta(s) marcada(s) como concluída(s)");
};

const start = async () => {
    while (true) {
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

            case "sair":
                return;

            default:
                console.log("Até a proxima!");
                break;
        }
    }
};

start();
