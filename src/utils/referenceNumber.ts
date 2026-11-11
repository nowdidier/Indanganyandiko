/**
 * Indanganyandiko Configurable Reference Number Engine
 * Allows each organization to define and enforce custom reference syntax
 * Supports tokens: [ORG], [DEPT], [CAT], [TYPE], [YEAR], [YY], [MONTH], [SEQ], [SEQ:n]
 */

export interface ReferenceContext {
  orgCode: string;
  deptCode: string;
  catCode?: string;
  docType: 'incoming' | 'outgoing' | 'internal' | 'customer_ticket';
  sequence: number;
  year?: number;
  month?: number;
}

export function formatDocTypeToken(docType: ReferenceContext['docType']): string {
  switch (docType) {
    case 'incoming':
      return 'IN';
    case 'outgoing':
      return 'OUT';
    case 'internal':
      return 'MEMO';
    case 'customer_ticket':
      return 'TCK';
    default:
      return 'DOC';
  }
}

export function generateReferenceNumber(pattern: string, context: ReferenceContext): string {
  const now = new Date();
  const year = context.year ?? now.getFullYear();
  const month = (context.month ?? now.getMonth() + 1).toString().padStart(2, '0');
  const yy = year.toString().slice(-2);
  const typeToken = formatDocTypeToken(context.docType);
  const orgToken = (context.orgCode || 'ORG').trim().toUpperCase();
  const deptToken = (context.deptCode || 'GEN').trim().toUpperCase();
  const catToken = (context.catCode || 'GEN').trim().toUpperCase();

  let result = pattern;

  // Replace fixed tokens
  result = result.replace(/\[ORG\]/gi, orgToken);
  result = result.replace(/\[DEPT\]/gi, deptToken);
  result = result.replace(/\[CAT\]/gi, catToken);
  result = result.replace(/\[TYPE\]/gi, typeToken);
  result = result.replace(/\[YEAR\]/gi, year.toString());
  result = result.replace(/\[YY\]/gi, yy);
  result = result.replace(/\[MONTH\]/gi, month);

  // Replace variable padded sequence tokens: e.g. [SEQ:4], [SEQ:5]
  result = result.replace(/\[SEQ:(\d+)\]/gi, (_, digits) => {
    const pad = parseInt(digits, 10) || 4;
    return context.sequence.toString().padStart(pad, '0');
  });

  // Replace bare [SEQ]
  result = result.replace(/\[SEQ\]/gi, context.sequence.toString().padStart(4, '0'));

  return result;
}

export function validatePattern(pattern: string): { valid: boolean; error?: string } {
  if (!pattern || pattern.trim() === '') {
    return { valid: false, error: 'Pattern cannot be empty' };
  }
  if (!pattern.includes('[SEQ') && !pattern.includes('[seq')) {
    return { valid: false, error: 'Pattern must include a sequence token like [SEQ] or [SEQ:4]' };
  }
  return { valid: true };
}

export function previewPattern(pattern: string, orgCode: string, deptCode: string, docType: ReferenceContext['docType'] = 'incoming'): string {
  return generateReferenceNumber(pattern, {
    orgCode: orgCode || 'SAMPLE',
    deptCode: deptCode || 'ADM',
    catCode: 'OFF',
    docType,
    sequence: 42,
    year: 2026,
    month: 11,
  });
}
