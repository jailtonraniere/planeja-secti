export type Status='Não iniciado'|'Em preenchimento'|'Pendente'|'Pronto para validação'|'Validado';
export type Provenance='Importada da base'|'Proposta para discussão'|'Validada na oficina'|'Pendente de informação'|'Divergência a validar';
export interface Project{id:string;name:string;executive:string;axis:string;objective:string;area:string;secondaryArea:string;initiatives:string[];goal:string;actual2025:string;target2026:string;target2027:string;target2028:string;unit:string;indicator:string;metric:string;frequency:string;owner:string;notes:string;status:Status;provenance:Provenance;divergence?:string;updatedAt:string;updatedBy:string}
export interface Participant{name:string;executive:string;role:string}
export interface IndicatorSuggestion{subject:string;name:string;executive:string;type:string;unit:string;metric:string;frequency:string;direction:string;owner:string;sourceRow:number}
