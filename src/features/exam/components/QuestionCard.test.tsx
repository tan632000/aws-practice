/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { QuestionCard } from './QuestionCard';
import type { QuestionSchema } from '../../../lib/types';

describe('QuestionCard', () => {
  afterEach(() => {
    cleanup();
  });

  const mockQuestion: QuestionSchema = {
    id: 'q1',
    text: 'Test question?',
    options: [
      { id: 'opt1', text: 'Correct Answer', isCorrect: true },
      { id: 'opt2', text: 'Wrong Answer', isCorrect: false }
    ],
    explanation: 'This is the explanation',
    trick: 'This is a trick'
  };

  it('evaluates answers correctly in practice mode', () => {
    const handleChange = vi.fn();
    render(
      <QuestionCard 
        question={mockQuestion} 
        selectedOptionIds={['opt2']} 
        onOptionChange={handleChange}
        isPracticeMode={true}
      />
    );

    // Initial state (no evaluation colors yet)
    const opt2Label = screen.getByTestId('option-opt2');
    expect(opt2Label.className).not.toContain('bg-rose-50');

    // Click check answer
    const checkBtn = screen.getByText('Check Answer');
    fireEvent.click(checkBtn);

    // Correct option should be green, wrong selected should be red
    const opt1Label = screen.getByTestId('option-opt1');
    expect(opt1Label.className).toContain('bg-emerald-50');
    expect(opt2Label.className).toContain('bg-rose-50');

    // Explanation should appear
    expect(screen.getByText('This is the explanation')).toBeDefined();
    
    // Trick button should appear
    const trickBtn = screen.getByText('Show Pro Tip');
    fireEvent.click(trickBtn);
    expect(screen.getByText('This is a trick')).toBeDefined();
  });

  it('renders checkboxes for multiple choice questions', () => {
    const multiMockQuestion: QuestionSchema = {
      id: 'q2',
      text: 'Multiple choice?',
      options: [
        { id: 'opt1', text: 'Correct 1', isCorrect: true },
        { id: 'opt2', text: 'Correct 2', isCorrect: true },
        { id: 'opt3', text: 'Wrong', isCorrect: false }
      ]
    };

    render(
      <QuestionCard 
        question={multiMockQuestion} 
        selectedOptionIds={[]} 
        onOptionChange={vi.fn()}
      />
    );

    // Should display instruction
    expect(screen.getByText('(Choose 2 answers)')).toBeDefined();

    // Inputs should be checkboxes
    const inputs = screen.getAllByRole('checkbox');
    expect(inputs).toHaveLength(3);
  });

  it('renders radio buttons for single choice questions', () => {
    render(
      <QuestionCard 
        question={mockQuestion} 
        selectedOptionIds={[]} 
        onOptionChange={vi.fn()}
      />
    );

    // Inputs should be radios
    const inputs = screen.getAllByRole('radio');
    expect(inputs).toHaveLength(2);
  });
});
