import faker from "faker";
import sinon from "sinon";
import requestSuperTest from "supertest";
import { createToken } from "../../../../shared/utils/token";
import { statusCode } from "../../../../shared/utils/status-code";
import { usersFixture } from "../fixtures";
import serverBuilder from "../../../../server-builder";
import { UserRepository } from "../../repository";
import { User } from "../../model";

describe("DELETE /user/:userId", () => {
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
    _userRepositoryStub.update.reset();
  });

  describe("successes", () => {
    test("Should delete a user by ID", async () => {
      const data: User = usersFixture({ enabled: true });

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);
      _userRepositoryStub.update
        .withArgs(data.id, { enabled: false })
        .resolves(true);

      const res = await _request
        .delete(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_token}`);

      expect(res.status).toBe(statusCode.NO_CONTENT);
    });
  });

  describe("failures", () => {
    test("Should not delete a user with unauthorized user", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);
      _userRepositoryStub.update
        .withArgs(data.id, { enabled: false })
        .resolves(true);

      const res = await _request.delete(`/users/${data.id}`);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should not delete a user with a not legit auth token", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);
      _userRepositoryStub.update
        .withArgs(data.id, { enabled: false })
        .resolves(true);

      const _invalidToken = createToken({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        enabled: true,
        secret: `invalid secret`,
      });

      const res = await _request
        .delete(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_invalidToken}`);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should not delete a user with a unknown user ID data", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(null);
      _userRepositoryStub.update
        .withArgs(data.id, { enabled: false })
        .resolves(true);

      const res = await _request
        .delete(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_token}`);

      expect(res.status).toBe(statusCode.NOT_FOUND);
    });

    test("Should not delete a user with an invalid user ID UUID format", async () => {
      const data: User = usersFixture();
      data.id = "invalid_user_id";

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);
      _userRepositoryStub.update
        .withArgs(data.id, { enabled: false })
        .resolves(true);

      const res = await _request
        .delete(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_token}`);

      expect(res.status).toBe(statusCode.NOT_FOUND);
    });

    test("Should return error 500 when DB operation fails", async () => {
      const data: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(data.id).resolves(data);
      _userRepositoryStub.update
        .withArgs(data.id, { enabled: false })
        .rejects();

      const res = await _request
        .delete(`/users/${data.id}`)
        .set("Authorization", `Bearer ${_token}`);

      expect(res.status).toBe(statusCode.INTERNAL_SERVER_ERROR);
    });
  });
});
