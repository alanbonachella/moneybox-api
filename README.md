# MoneyBox API!

A API foi feita em typescript usando node e express para expor os endpoints via http.

Para rodar local, temos que executar dois comandos no terminal

**0** - Instale as dependencias do sistema:

> yarn install

**1** - Rode em um terminal o comando:

> yarn build

**Obs:** esse comando é responsável por transpilar nosso código para javascript, e depois vamos iniciar o servidor para que ele execute o código js transpilado.

> yarn start

**Obs:** esse comando é responsável por iniciar a aplicação.

# MoneyBox API Workflow!

Temos que criar um usuário do sistema(a conta é criada automaticamente), e logo após temos que fazer o login para gerar o token para acesso das demais rotas.

Agora com o token em mãos podemos fazer o uso do sistema, temos o CRUD de usuário e as ações deposito/saque dentro de account(peça o arquivo POSTMAN, ainda não temos swagger).

**Obs:** A aplicação não tem banco configurado, todos os dados estão em memória e ao reiniciar a API perderá todo o estado da aplicação.
