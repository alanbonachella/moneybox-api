export type ServicesCollection = {
  db: any;
};

export const setupServices = (db: {} = {}): ServicesCollection => {
  return {
    db,
  };
};
