// Personalize estes campos antes de apresentar o site como uma loja real.
export const config = {
  whatsapp: 'SEU_NUMERO_COM_DDI_E_DDD', // Ex.: 5511999999999. Somente dígitos.
  instagram: '', // URL completa do perfil real.
  email: '',
  address: 'Endereço do ateliê a personalizar',
  hours: 'Horários de atendimento a personalizar',
};
export const hasWhatsApp = () => /^\d{10,15}$/.test(config.whatsapp);
export const whatsappURL = message => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
