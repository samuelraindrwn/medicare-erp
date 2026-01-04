import { Employee } from "./mock-data";

export interface PayrollRun {
  id: string;
  period: string; // e.g., "January 2026"
  status: "Draft" | "Processing" | "Completed";
  totalEmployees: number;
  totalAmount: number;
  runDate: string;
}

export interface Payslip {
  employeeId: string;
  period: string;
  baseSalary: number;
  allowances: {
    transport: number;
    meal: number;
    housing: number;
    total: number;
  };
  variable: {
    overtime: number;
    bonus: number;
    total: number;
  };
  grossSalary: number;
  deductions: {
    tax: number; // PPh 21
    bpjsKesehatan: number;
    bpjsKetenagakerjaan: number;
    loan: number;
    total: number;
  };
  netSalary: number;
  companyContributions: {
    bpjsKesehatan: number;
    bpjsKetenagakerjaan: number;
  };
}

export const calculateBPJS = (salary: number) => {
  // BPJS Kesehatan
  // Employee: 1%, Employer: 4% -> Cap at appropriate salary level (mocking 12jt cap approx)
  const healthCap = 12000000;
  const healthBasis = Math.min(salary, healthCap);

  const bpjsKesehatanEmp = healthBasis * 0.01;
  const bpjsKesehatanComp = healthBasis * 0.04;

  // BPJS Ketenagakerjaan (JHT)
  // Employee: 2%, Employer: 3.7%
  const jhtEmp = salary * 0.02;
  const jhtComp = salary * 0.037;

  // JKK + JKM (Employer only) ~ 0.54%
  const otherComp = salary * 0.0054;

  return {
    employee: {
      kesehatan: bpjsKesehatanEmp,
      ketenagakerjaan: jhtEmp,
      total: bpjsKesehatanEmp + jhtEmp,
    },
    company: {
      kesehatan: bpjsKesehatanComp,
      ketenagakerjaan: jhtComp + otherComp,
      total: bpjsKesehatanComp + jhtComp + otherComp,
    },
  };
};

export const calculateTax = (
  grossSalary: number,
  taxStatus: string,
  bpjsDeduction: number,
  method: "GROSS" | "NET" = "GROSS"
) => {
  // 1. Annualize
  // If NET method (Gross Up), we simplify for this mock: Company pays tax, so tax is NOT deducted from Employee GROSS for THP,
  // but logically it is calculated on top.
  // For "GROSS" method: Standard PPh 21 deducted from salary.

  const annualGross = grossSalary * 12;

  // 2. PTKP (Non-Taxable Income)
  let ptkp = 54000000; // TK/0
  if (taxStatus.startsWith("K/")) {
    ptkp += 4500000; // Married
    const children = parseInt(taxStatus.split("/")[1]);
    ptkp += children * 4500000;
  }

  // 3. Biaya Jabatan (5% max 6jt/year)
  const biayaJabatan = Math.min(annualGross * 0.05, 6000000);

  // 4. Net Annual Income
  const annualBPJSDeduction = bpjsDeduction * 12;
  const netAnnual = annualGross - biayaJabatan - annualBPJSDeduction - ptkp;

  if (netAnnual <= 0) return 0;

  // 5. Progressive Tax Rates (Simplified)
  // 0 - 60jt: 5%
  // 60jt - 250jt: 15%
  // 250jt - 500jt: 25%
  // 500jt - 5B: 30%
  // > 5B: 35%

  let taxable = netAnnual;
  let annualTax = 0;

  if (taxable > 0) {
    const tier1 = Math.min(taxable, 60000000);
    annualTax += tier1 * 0.05;
    taxable -= tier1;
  }
  if (taxable > 0) {
    const tier2 = Math.min(taxable, 190000000); // 250 - 60
    annualTax += tier2 * 0.15;
    taxable -= tier2;
  }
  if (taxable > 0) {
    const tier3 = Math.min(taxable, 250000000); // 500 - 250
    annualTax += tier3 * 0.25;
    taxable -= tier3;
  }
  if (taxable > 0) {
    const tier4 = Math.min(taxable, 4500000000); // 5B - 500
    annualTax += tier4 * 0.3;
    taxable -= tier4;
  }
  if (taxable > 0) {
    annualTax += taxable * 0.35;
  }

  return Math.round(annualTax / 12);
};

interface VariablePayInput {
  overtimeHours: number;
  bonus: number;
  deductions: number;
}

export const generatePayslip = (
  employee: Employee,
  period: string,
  variable: VariablePayInput = { overtimeHours: 0, bonus: 0, deductions: 0 },
  config: { taxMethod: "GROSS" | "NET" } = { taxMethod: "GROSS" }
): Payslip => {
  if (!employee.baseSalary || !employee.taxStatus) {
    throw new Error(`Employee ${employee.id} missing payroll data`);
  }

  const { transport, meal, housing } = employee.allowances;
  const totalAllowances = transport + meal + housing;

  // Calculate Overtime Amount
  const hourlyRate = Math.round(employee.baseSalary / 173);
  const overtimeAmount = variable.overtimeHours * hourlyRate;
  const totalVariable = overtimeAmount + variable.bonus;

  const grossSalary = employee.baseSalary + totalAllowances + totalVariable;

  // Calculate BPJS
  const bpjs = calculateBPJS(employee.baseSalary);

  // Calculate Tax
  const tax = calculateTax(
    grossSalary,
    employee.taxStatus,
    bpjs.employee.total,
    config.taxMethod
  );

  // If NET method, tax is paid by company (mock logic: tax is calculated but not deducted from THP in the same way,
  // OR we interpret NET as "Salary specified is the NET amount".
  // For simplicity in this demo: If NET, we don't deduct tax from THP, effectively determining company pays it).
  const taxDeduction = config.taxMethod === "GROSS" ? tax : 0;

  return {
    employeeId: employee.id,
    period,
    baseSalary: employee.baseSalary,
    allowances: {
      transport,
      meal,
      housing,
      total: totalAllowances,
    },
    variable: {
      overtime: overtimeAmount,
      bonus: variable.bonus,
      total: totalVariable,
    },
    grossSalary,
    deductions: {
      tax: tax, // We show tax value either way
      bpjsKesehatan: bpjs.employee.kesehatan,
      bpjsKetenagakerjaan: bpjs.employee.ketenagakerjaan,
      loan: variable.deductions,
      total: taxDeduction + bpjs.employee.total + variable.deductions,
    },
    netSalary:
      grossSalary - (taxDeduction + bpjs.employee.total + variable.deductions),
    companyContributions: {
      bpjsKesehatan: bpjs.company.kesehatan,
      bpjsKetenagakerjaan: bpjs.company.ketenagakerjaan,
    },
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
