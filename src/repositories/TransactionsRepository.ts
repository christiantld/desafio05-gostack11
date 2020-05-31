import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomes = transactions.filter(
      transaction => transaction.type === 'income',
    );

    const incomeTotal = incomes.reduce((sum, income) => {
      return sum + Number(income.value);
    }, 0);

    const outcomes = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const outcomeTotal = outcomes.reduce((sum, outcome) => {
      return sum + Number(outcome.value);
    }, 0);

    const total = incomeTotal - outcomeTotal;

    return {
      income: incomeTotal,
      outcome: outcomeTotal,
      total,
    };
  }
}

export default TransactionsRepository;
