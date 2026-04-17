import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-abyss mb-2">Card Title</h3>
        <p className="text-lagoon">
          This is a simple card component that can contain any content.
        </p>
      </div>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    children: (
      <>
        <div className="px-6 py-4 border-b border-mist">
          <h3 className="text-lg font-semibold text-abyss">Card with Header</h3>
        </div>
        <div className="p-6">
          <p className="text-lagoon">
            Card content goes here. The header is separated by a border.
          </p>
        </div>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    children: (
      <>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-abyss mb-2">Card with Footer</h3>
          <p className="text-lagoon">
            This card has a footer with action buttons.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-mist bg-breeze flex justify-end gap-3">
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Save</Button>
        </div>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    className: 'cursor-pointer hover:shadow-lg transition-shadow',
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-abyss mb-2">Interactive Card</h3>
        <p className="text-lagoon">
          Hover over this card to see the shadow effect.
        </p>
      </div>
    ),
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-3xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <div className="p-4">
            <h4 className="font-semibold text-abyss mb-1">Card {i}</h4>
            <p className="text-sm text-lagoon">Card content</p>
          </div>
        </Card>
      ))}
    </div>
  ),
};
