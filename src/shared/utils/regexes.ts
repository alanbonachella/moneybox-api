export const phoneNumber = /^(\(\d{2}\)\s)(\d{0,1}\s{0,1}\d{4}\-\d{4})$/;

export const CPF = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

export const UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const JWT = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

export const zipCode = /^\d{5}[-]\d{3}$/;

export const state = /^[A-Z]{2}$/;

export const latitude = /^(-?\d+(\.\d+)?)\.\s*(-?\d+(\.\d+)?)$/;

export const longitude = /^(-?\d+(\.\d+)?)\.\s*(-?\d+(\.\d+)?)$/;

export const email = /^[a-zA-Z0-9_\-\.\+]+@[a-zA-Z0-9_\-\.]+[a-zA-Z]{2,5}$/;

export const time = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

export const timeMinutesZeroOrThirty = /^([01][0-9]|2[0-3]):([0|3][0])$/;

export const date = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
