# Site do Workshop (MkDocs)

Este repositório contém um site estático em **Markdown** gerado com [MkDocs](https://www.mkdocs.org/).  
Edite os arquivos em `docs/` e o menu é controlado por `mkdocs.yml`.

## Como rodar localmente

```bash
# (Opcional) crie e ative um ambiente virtual
python -m venv .venv && source .venv/bin/activate

# Instale o MkDocs
pip install mkdocs

# Suba o servidor local
mkdocs serve
```

Acesse em <http://127.0.0.1:8000>.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub e faça o push deste projeto.
2. Execute:
   ```bash
   mkdocs gh-deploy
   ```
   Isso criará/atualizará o branch `gh-pages` com o site.
3. No GitHub, em **Settings → Pages**, confirme que a fonte está como `gh-pages`.

## Estrutura

```
workshop-site/
├─ mkdocs.yml
├─ docs/
│  ├─ index.md           # Sobre o evento
│  ├─ programacao.md     # Programação
│  ├─ palestrantes.md    # Palestrantes
│  ├─ inscricao.md       # Inscrição
│  └─ contato.md         # Contato
└─ README.md
```

> Você pode trocar o tema, cores e logo editando `mkdocs.yml`. Para usar o tema Material, instale `pip install mkdocs-material` e troque `theme.name` para `material`.
