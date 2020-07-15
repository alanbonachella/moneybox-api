import faker from "faker";
import sinon from "sinon";
import requestSuperTest from "supertest";
import { createToken } from "../../../../shared/utils/token";
import { statusCode } from "../../../../shared/utils/status-code";
import { usersFixture } from "../fixtures";
import { UserResponse } from "../../dto";
import serverBuilder from "../../../../server-builder";
import { UserRepository } from "../../repository";
import { User } from "../../model";

describe("GET /users", () => {
  const sandbox = sinon.createSandbox();

  let _request;
  let _token;
  let _dbStub;
  let _userRepositoryStub;

  beforeAll(async () => {
    _userRepositoryStub = sandbox.createStubInstance(UserRepository);

    _dbStub = {
      userRepository: _userRepositoryStub,
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
    _userRepositoryStub.find.reset();
  });

  describe("successes", () => {
    test("Should get all users", async () => {
      const data: User[] = [usersFixture(), usersFixture(), usersFixture()];

      // Mocking data
      _userRepositoryStub.find.withArgs().resolves(data);

      const res = await _request
        .get(`/users`)
        .set("Authorization", `Bearer ${_token}`);

      const users = res.body as UserResponse[];

      expect(res.status).toBe(statusCode.OK);
      expect(Array.isArray(users)).toBeTruthy();
      expect(users.length).toBe(data.length);
      users.forEach((user, i) => {
        expect(res.body[i].password).toBeUndefined();
        expect(user.id).toBe(data[i].id);
        expect(user.name).toBe(data[i].name);
        expect(user.cpf).toBe(data[i].cpf);
        expect(user.enabled).toBe(true);
        expect(user.createdAt).toBeTruthy();
        expect(user.updatedAt).toBeTruthy();
      });
    });

    test("Should get empty result when there is no user recorded yet", async () => {
      const data: User[] = [];

      // Mocking data
      _userRepositoryStub.find
        .withArgs({
          enabled: true,
        })
        .resolves(data);

      const res = await _request
        .get(`/users`)
        .set("Authorization", `Bearer ${_token}`);

      const users = res.body as UserResponse[];

      expect(res.status).toBe(statusCode.OK);
      expect(Array.isArray(users)).toBeTruthy();
      expect(users.length).toBe(0);
    });

    test("Should get all users when 3 user enabled and 2 user disabled", async () => {
      const data: User[] = [
        usersFixture({ enabled: true }),
        usersFixture({ enabled: false }),
        usersFixture({ enabled: true }),
        usersFixture({ enabled: false }),
        usersFixture({ enabled: true }),
      ];

      const expected = data.filter((user) => user.enabled);

      // Mocking data
      _userRepositoryStub.find.withArgs({ enabled: true }).resolves(expected);

      const res = await _request
        .get(`/users`)
        .set("Authorization", `Bearer ${_token}`);

      const users = res.body as UserResponse[];

      expect(res.status).toBe(statusCode.OK);
      expect(Array.isArray(users)).toBeTruthy();
      expect(users.length).toBe(expected.length);
      users.forEach((user, i) => {
        expect(res.body[i].password).toBeUndefined();
        expect(user.id).toBe(expected[i].id);
        expect(user.name).toBe(expected[i].name);
        expect(user.cpf).toBe(expected[i].cpf);
        expect(user.enabled).toBe(true);
        expect(user.createdAt).toBeTruthy();
        expect(user.updatedAt).toBeTruthy();
      });
    });
  });

  describe("failures", () => {
    test("Should not get all users with unauthorised user", async () => {
      const data: User[] = [usersFixture(), usersFixture(), usersFixture()];

      // Mocking data
      _userRepositoryStub.find.withArgs({ enabled: true }).resolves(data);

      const res = await _request.get(`/users`);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should not get all users with a not legit auth token", async () => {
      const data: User[] = [usersFixture(), usersFixture(), usersFixture()];

      // Mocking data
      _userRepositoryStub.find.withArgs({ enabled: true }).resolves(data);

      const _invalidToken = createToken({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        enabled: true,
        secret: `invalid secret`,
      });

      const res = await _request
        .get(`/users`)
        .set("Authorization", `Bearer ${_invalidToken}`);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should return error 500 when DB operation fails", async () => {
      // Mocking data
      _userRepositoryStub.find.withArgs().rejects();

      const res = await _request
        .get(`/users`)
        .set("Authorization", `Bearer ${_token}`);

      expect(res.status).toBe(statusCode.INTERNAL_SERVER_ERROR);
    });
  });
});
