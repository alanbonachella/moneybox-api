import faker from "faker";
import sinon from "sinon";
import requestSuperTest from "supertest";
import { createToken } from "../../../../shared/utils/token";
import { statusCode } from "../../../../shared/utils/status-code";
import { usersRequestFixture, usersFixture } from "../fixtures";
import { UserResponse, UserRequest } from "../../dto";
import serverBuilder from "../../../../server-builder";
import * as regexes from "../../../../shared/utils/regexes";
import { UserRepository } from "../../repository";
import { User } from "../../model";
import { AccountRepository } from "../../../../contexts/accounts/repository";
import { Account } from "../../../../contexts/accounts/model";

describe("POST /users", () => {
  const sandbox = sinon.createSandbox();

  let _request;
  let _token;
  let _dbStub;
  let _userRepositoryStub;
  let _accountRepositoryStub;

  beforeAll(async () => {
    _userRepositoryStub = sandbox.createStubInstance(UserRepository);
    _accountRepositoryStub = sandbox.createStubInstance(AccountRepository);

    _dbStub = {
      userRepository: _userRepositoryStub,
      accountRepository: _accountRepositoryStub,
    };

    _request = requestSuperTest(await serverBuilder({ db: _dbStub }));
    _token = createToken({
      id: faker.random.uuid(),
      name: faker.name.findName(),
      enabled: true,
    });
  });

  afterAll(() => {
    sandbox.restore();
  });

  afterEach(() => {
    _userRepositoryStub.save.reset();
    _userRepositoryStub.findOne.reset();
  });

  describe("successes", () => {
    test("Should create a user with router", async () => {
      const data: UserRequest = usersRequestFixture();

      // Mocking data
      _userRepositoryStub.find.withArgs({ cpf: data.cpf }).resolves([]);

      _accountRepositoryStub.save
        .withArgs(sinon.match.instanceOf(Account))
        .callsFake((account) => Promise.resolve(account));

      _userRepositoryStub.save
        .withArgs(sinon.match.instanceOf(User))
        .callsFake((user) => Promise.resolve(user));

      const res = await _request
        .post("/users")
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      const user = res.body as UserResponse;

      expect(res.status).toBe(statusCode.CREATED);
      expect(res.body.password).toBeUndefined();
      expect(user.id).toMatch(regexes.UUID);
      expect(user.name).toBe(data.name);
      expect(user.cpf).toBe(data.cpf);
      expect(user.enabled).toBe(true);
      expect(user.createdAt).toBeTruthy();
      expect(user.updatedAt).toBeTruthy();
    });
  });

  describe("failures", () => {
    test("Should not create a user with unauthorized user", async () => {
      const data: UserRequest = usersRequestFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs({ cpf: data.cpf }).resolves(null);
      _userRepositoryStub.save
        .withArgs(sinon.match.instanceOf(User))
        .callsFake((user) => Promise.resolve(user));

      const res = await _request.post("/users").send(data);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should not create a user with invalid auth token", async () => {
      const data: UserRequest = usersRequestFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs({ cpf: data.cpf }).resolves(null);
      _userRepositoryStub.save
        .withArgs(sinon.match.instanceOf(User))
        .callsFake((user) => Promise.resolve(user));

      const _invalidToken = createToken({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        enabled: true,
        secret: `invalid secret`,
      });

      const res = await _request
        .post("/users")
        .set("Authorization", `Bearer ${_invalidToken}`)
        .send(data);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should not create a user with empty body data", async () => {
      const user = usersFixture() as User;
      const data = {};

      // Mocking data
      _userRepositoryStub.findOne.withArgs({ cpf: user.cpf }).resolves(null);
      _userRepositoryStub.save
        .withArgs(sinon.match.instanceOf(User))
        .callsFake((user) => Promise.resolve(user));

      const res = await _request
        .post("/users")
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      expect(res.status).toBe(statusCode.BAD_REQUEST);
    });

    test("Should not create a user with missing cpf data", async () => {
      const data: UserRequest = usersRequestFixture();

      // Mocking data
      _userRepositoryStub.save.resolves();
      _userRepositoryStub.findOne.withArgs({ cpf: data.cpf }).resolves(null);

      delete data.cpf;

      const res = await _request
        .post("/users")
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      expect(res.status).toBe(statusCode.BAD_REQUEST);
    });

    test("Should not create a user whose CPF already exists", async () => {
      const data: UserRequest = usersRequestFixture();

      // Mocking data
      _userRepositoryStub.save.resolves(usersFixture(data) as User);

      _userRepositoryStub.find
        .withArgs({ cpf: data.cpf })
        .resolves([{ cpf: data.cpf } as User]);

      const res = await _request
        .post("/users")
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      expect(res.status).toBe(statusCode.CONFLICT);
    });

    test("Should return error 500 when DB operation fails", async () => {
      const data: UserRequest = usersRequestFixture();

      // Mocking data
      _userRepositoryStub.save.rejects(); // Simulating DB operation failure
      _userRepositoryStub.findOne.rejects();

      const res = await _request
        .post("/users")
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      expect(res.status).toBe(statusCode.INTERNAL_SERVER_ERROR);
    });
  });
});
