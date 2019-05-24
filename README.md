# Ghost

Welcome,
this is Ghost, an electron app for code quality analysis through git.

## Development

Run local web development server

```bash
$ yarn dev
```

Start the electron development

```bash
$ yarn start-dev
```

### Production mode and packaging app

Package the web content

```bash
$ yarn build
```

Package and create the app

```bash
$ yarn dist
```


### Testing

before testing, change nodeIntegration to true in main.js

run local web dev server

```bash
$ yarn dev
```

Run tests

```bash
$ yarn test
```