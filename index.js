import { select } from "@inquirer/prompts";

const start = async () => {
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

    while (true) {
        switch (option) {
            case "cadastrar":
                break;

            case "listar":
                break;

            case "sair":
                return;
                break;

            default:
                break;
        }
    }
};

start();
