import { select, input } from "@inquirer/prompts";

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

const listarMetas = async () => {};

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
                console.log(metas);
                break;

            case "listar":
                listarMetas();
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
