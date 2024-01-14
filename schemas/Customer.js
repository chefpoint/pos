/* * * * * */
/* SCHEMA: CUSTOMER */
/* * */

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["Customer"] Object */
export default yup.object({
  first_name: yup.string().min(2, 'Nome deve ter pelo menos ${min} caracteres').max(30, 'Nome não deve ter mais do que ${max} caracteres').required('Nome é obrigatório'),
  last_name: yup.string().max(30, 'Apelido não deve ter mais do que ${max} caracteres'),
  tax_region: yup
    .string()
    .matches(/^$|^[a-zA-Z]{2}$/, 'Região Fiscal são duas letras (ex: PT, NL)')
    .uppercase(),
  tax_number: yup
    .string()
    .matches(/^$|^[0-9]{9}$/, 'Número de Contribuinte são 9 números (ex: 123 456 789)')
    .transform((value) => value.replace(/\s+/g, ''))
    .required('Número de Contribuinte é obrigatório'),
  contact_email: yup.string().lowercase().email(),
  send_invoices: yup.boolean().default(true),
  reference: yup.string().max(30, 'Nr. do Cartão TP não deve ter mais do que ${max} caracteres'),
  birthday: yup.string(),
});
