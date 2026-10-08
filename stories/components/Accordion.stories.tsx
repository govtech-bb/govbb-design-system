import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import {
  Accordion,
  AccordionSection,
} from '../../packages/react/src/accordion/accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  render: (args) => (
    <Accordion {...args}>
      <AccordionSection heading="Before you apply">
        <p>Check you have your national registration number to hand.</p>
      </AccordionSection>
      <AccordionSection heading="What it costs">
        <p>The fee is BBD 50, payable when you submit the application.</p>
      </AccordionSection>
      <AccordionSection heading="How long it takes">
        <p>Most applications are decided within 10 working days.</p>
      </AccordionSection>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const sections = canvasElement.querySelectorAll('details');
    const summary = canvas.getByText('Before you apply');

    await expect(sections[0].open).toBe(false);
    await userEvent.click(summary);
    await expect(sections[0].open).toBe(true);
    await expect(sections[1].open).toBe(false);
  },
};

export const OneSectionAtATime: Story = {
  args: { allowsMultipleExpanded: false },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const sections = canvasElement.querySelectorAll('details');

    await userEvent.click(canvas.getByText('Before you apply'));
    await expect(sections[0].open).toBe(true);
    await userEvent.click(canvas.getByText('What it costs'));
    await expect(sections[1].open).toBe(true);
    await expect(sections[0].open).toBe(false);
  },
};

export const Divided: Story = {
  args: { variant: 'divided' },
  play: async ({ canvasElement }) => {
    const [first] = canvasElement.querySelectorAll('.govbb-accordion__section');
    const summary = canvasElement.querySelector('.govbb-accordion__summary');

    await expect(first).toHaveStyle({ borderBottomWidth: '2px' });
    await expect(summary).toHaveStyle({ borderTopLeftRadius: '0px' });
  },
};

export const Boxed: Story = {
  args: { variant: 'boxed' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.govbb-accordion')!;
    const [, second] = canvasElement.querySelectorAll(
      '.govbb-accordion__section',
    );

    await expect(root).toHaveStyle({ borderWidth: '2px' });
    await expect(second).toHaveStyle({ borderTopWidth: '2px' });
  },
};

export const Cards: Story = {
  args: { variant: 'cards' },
  play: async ({ canvasElement }) => {
    const [first] = canvasElement.querySelectorAll('.govbb-accordion__section');

    await expect(first).toHaveStyle({ borderWidth: '2px' });
  },
};

export const IconAndHint: Story = {
  render: () => (
    <Accordion>
      <AccordionSection
        heading="What it costs"
        hint="The fee, and the ways you can pay it"
        icon={
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <circle cx="8" cy="8" r="6.5" strokeWidth="2" />
            <path d="M8 5v6M6 9.5h4" strokeWidth="2" />
          </svg>
        }
      >
        <p>The fee is BBD 50, payable when you submit the application.</p>
      </AccordionSection>
      <AccordionSection
        heading="How long it takes"
        hint="From submission to a decision"
      >
        <p>Most applications are decided within 10 working days.</p>
      </AccordionSection>
    </Accordion>
  ),
  play: async ({ canvas, canvasElement }) => {
    const icon = canvasElement.querySelector('.govbb-accordion__icon')!;

    await expect(icon.getAttribute('aria-hidden')).toBe('true');
    await expect(
      canvas.getByText('From submission to a decision'),
    ).toBeVisible();
  },
};

export const Nested: Story = {
  render: () => (
    <Accordion allowsMultipleExpanded={false}>
      <AccordionSection heading="General settings">
        <Accordion>
          <AccordionSection heading="Language">
            <p>Pick the language the service is shown in.</p>
          </AccordionSection>
          <AccordionSection heading="Timezone">
            <p>Timestamps follow your local timezone.</p>
          </AccordionSection>
        </Accordion>
      </AccordionSection>
      <AccordionSection heading="Notifications">
        <p>Choose which updates reach you by email.</p>
      </AccordionSection>
    </Accordion>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const [outer, language] = canvasElement.querySelectorAll('details');

    // Opening an inner section must not close the outer one around it.
    await userEvent.click(canvas.getByText('General settings'));
    await userEvent.click(canvas.getByText('Language'));
    await expect(language.open).toBe(true);
    await expect(outer.open).toBe(true);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const [first] = canvasElement.querySelectorAll('details');
    const summary = canvasElement.querySelector('.govbb-accordion__summary')!;

    await expect(summary.getAttribute('aria-disabled')).toBe('true');
    await expect(summary.getAttribute('tabindex')).toBe('-1');
    await expect(summary).toHaveStyle({ pointerEvents: 'none' });

    // A click that reaches the summary anyway (AT, a script) must not open it.
    summary.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    await expect(first.open).toBe(false);
  },
};
