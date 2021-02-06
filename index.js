const axios = require("axios");
const puppeteer = require("puppeteer");

const user = "rbalves";
var repos = [];

async function getRepositories() {
  return await axios.get(`https://api.github.com/users/${user}/repos`);
}

function customRepository(repository) {
  const { title, description, created_at, language } = repository;
  return {
    title: title || "None",
    description: description || "None",
    created_at: created_at.substr(0, 10) || "None",
    language: language || "None",
  };
}

async function getFormattedRepos() {
  const { data } = await getRepositories();
  repos = data.map((repo) => customRepository(repo));
}

getFormattedRepos();

async function startAutomation() {
  const PATH_BUTTON_OPEN_MODAL = 'button[id="btn_open_modal"]';
  const PATH_INPUT_TITLE = 'input[id="input-titulo"]';
  const PATH_INPUT_DESCRIPTION = 'input[id="input-descricao"]';
  const PATH_INPUT_CREATED_AT = 'input[id="input-criacao"]';
  const PATH_INPUT_LANGUAGE = 'input[id="input-linguagem"]';
  const PATH_BUTTON_ADD = 'button[id="btn_add_projeto"]';

  const browser = await puppeteer.launch({
    headless: false,
    args: [
        "--start-maximized",
    ],
  });

  const page = await browser.newPage();
  await page.goto(
    "https://rbalves.github.io/app-automacao-selenium-api-github/"
  );

  const clickButton = async (path) => {
    await page.waitForSelector(path);
    await page.click(path);
  };

  const insertValue = async (path, value) => {
    await page.waitForSelector(path);
    await page.type(path, value, {delay: 20})
  }

  const fillForm = async (repo) => {
    await insertValue(PATH_INPUT_TITLE, repo.title);
    await insertValue(PATH_INPUT_DESCRIPTION, repo.description);
    await insertValue(PATH_INPUT_CREATED_AT, repo.created_at);
    await insertValue(PATH_INPUT_LANGUAGE, repo.language);
  };

  for (const repo of repos) {
    await clickButton(PATH_BUTTON_OPEN_MODAL);
    await fillForm(repo);
    await clickButton(PATH_BUTTON_ADD);
  }
}

startAutomation();
