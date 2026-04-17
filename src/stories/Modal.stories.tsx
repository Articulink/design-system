import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalTemplate = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-abyss mb-4">Modal Title</h2>
          <p className="text-lagoon mb-6">
            This is the modal content. You can put any content here, including forms,
            images, or other components.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Modal Title',
  },
};

export const Small: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Small Modal',
    size: 'sm',
  },
};

export const Large: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    title: 'Large Modal',
    size: 'lg',
  },
};

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Profile">
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-abyss mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-mist rounded-lg"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-abyss mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-mist rounded-lg"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};
