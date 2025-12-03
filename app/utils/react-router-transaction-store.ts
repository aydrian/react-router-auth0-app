import {
  AbstractTransactionStore,
  type EncryptedStoreOptions,
  type TransactionData
} from "@auth0/auth0-server-js";
import type { SessionStorage } from "react-router";

export interface StoreOptions {
  request: Request;
  response: Response;
}

export class ReactRouterTransactionStore extends AbstractTransactionStore<StoreOptions> {
  #store: SessionStorage;

  constructor(options: EncryptedStoreOptions, store: SessionStorage) {
    super(options);
    this.#store = store;
  }

  async set(
    identifier: string,
    state: TransactionData,
    removeIfExists?: boolean,
    options?: StoreOptions | undefined
  ): Promise<void> {
    if (!options) {
      throw new Error("StoreOptions not provided");
    }

    const session = await this.#store.getSession(
      options.request.headers.get("Cookie")
    );

    session.set(identifier, state);
    options.response.headers.append(
      "Set-Cookie",
      await this.#store.commitSession(session)
    );
  }

  async get(
    identifier: string,
    options?: StoreOptions | undefined
  ): Promise<TransactionData | undefined> {
    if (!options) {
      throw new Error("StoreOptions not provided");
    }

    const session = await this.#store.getSession(
      options.request.headers.get("Cookie")
    );
    return session.get(identifier);
  }

  async delete(
    identifier: string,
    options?: StoreOptions | undefined
  ): Promise<void> {
    if (!options) {
      throw new Error("StoreOptions not provided");
    }

    const session = await this.#store.getSession(
      options.request.headers.get("Cookie")
    );

    session.unset(identifier);
    options.response.headers.append(
      "Set-Cookie",
      await this.#store.commitSession(session)
    );
  }
}
