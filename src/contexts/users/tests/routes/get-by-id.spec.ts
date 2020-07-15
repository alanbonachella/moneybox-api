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

describe("GET /users/:userId", () => {
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
    _userRepositoryStub.findOne.reset();
  });

  describe("successes", () => {
    test("Should get a user by ID", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);

      const res = await _request
        .get(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_token}`);

      const user = res.body as UserResponse;

      expect(res.status).toBe(statusCode.OK);
      expect(res.body.password).toBeUndefined();
      expect(user.id).toBe(data.id);
      expect(user.name).toBe(data.name);
      expect(user.cpf).toBe(data.cpf);
      expect(user.enabled).toBe(true);
      expect(user.createdAt).toBeTruthy();
      expect(user.updatedAt).toBeTruthy();
    });
  });

  describe("failures", () => {
    test("Should not get a user with unauthorized user", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);

      const res = await _request.get(`/users/${data.id}`);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should not get a user with a not legit auth token", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);

      const _invalidToken = createToken({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        enabled: true,
        secret: `invalid secret`,
      });

      const res = await _request
        .get(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_invalidToken}`);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should not get a user with an unknown user ID data", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(null);

      const res = await _request
        .get(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_token}`);

      expect(res.status).toBe(statusCode.NOT_FOUND);
    });

    test("Should not get a user with an invalid user ID UUID format", async () => {
      const data: User = usersFixture();
      data.id = "invalid_user_id";

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);

      const res = await _request
        .get(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_token}`);

      expect(res.status).toBe(statusCode.NOT_FOUND);
    });

    test("Should return error 500 when DB operation fails", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).rejects();

      const res = await _request
        .get(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_token}`);

      expect(res.status).toBe(statusCode.INTERNAL_SERVER_ERROR);
    });
  });
});
