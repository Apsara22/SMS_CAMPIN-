import React, { useState } from 'react';
import api from "../../services/Api";
import { v4 as uuidv4 } from 'uuid';

// Enhanced type definitions
type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'date';

type FormField = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: {
    id: string;
    value: string;
  }[];
  order: number;
};

type CampaignData = {
  name: string;
  description: string;
  form_fields: FormField[];
};

type FieldCreationStep = 'type' | 'details' | 'options';

const NewCampaign: React.FC = () => {
  // Main campaign state
  const [campaign, setCampaign] = useState<CampaignData>({
    name: '',
    description: '',
    form_fields: [],
  });

  // Field creation state
  const [newField, setNewField] = useState<Omit<FormField, 'id' | 'order'>>({
    type: 'text',
    label: '',
    required: false,
  });

  const [fieldCreationStep, setFieldCreationStep] = useState<FieldCreationStep>('type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Helper functions
  const needsOptions = (type: FieldType): boolean => {
    return ['dropdown', 'checkbox', 'radio'].includes(type);
  };

  const validateField = (field: Omit<FormField, 'id' | 'order'>): string | null => {
    if (!field.label.trim()) return 'Field label is required';
    
    if (needsOptions(field.type) && (!field.options || field.options.length === 0)) {
      return 'At least one option is required';
    }
    
    return null;
  };

  // Event handlers
  const handleCampaignChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setNewField(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(newField.options || [])];
    newOptions[index] = { ...newOptions[index], value };
    setNewField(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setNewField(prev => ({
      ...prev,
      options: [...(prev.options || []), { id: uuidv4(), value: '' }],
    }));
  };

  const removeOption = (index: number) => {
    const newOptions = [...(newField.options || [])];
    newOptions.splice(index, 1);
    setNewField(prev => ({ ...prev, options: newOptions }));
  };

  const addField = () => {
    const error = validateField(newField);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setCampaign(prev => ({
      ...prev,
      form_fields: [
        ...prev.form_fields,
        {
          ...newField,
          id: uuidv4(),
          order: prev.form_fields.length,
        }
      ],
    }));

    // Reset for next field
    setNewField({
      type: 'text',
      label: '',
      required: false,
      options: undefined,
    });
    setFieldCreationStep('type');
    setErrorMessage('');
  };

  const removeField = (id: string) => {
    setCampaign(prev => ({
      ...prev,
      form_fields: prev.form_fields.filter(field => field.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    const response = await api.post('/campaigns', {
      name: campaign.name,
      description: campaign.description,
      form_fields: campaign.form_fields,
      total_sms: 0 // Set initial value
    });
    
    setSuccessMessage('Campaign created successfully!');
    // Redirect to campaigns list after creation
    navigate('/campaigns');
  } catch (error) {
    console.error('Error creating campaign:', error);
    setErrorMessage(error.response?.data?.error || 'Failed to create campaign');
  } finally {
    setIsSubmitting(false);
  }
};
  // Render functions
  const renderFieldPreview = (field: FormField) => {
    // ... (keep your existing renderFieldPreview implementation, but update to use field.id instead of index)
  };

  const renderFieldTypeStep = () => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Select Field Type</h4>
      <div className="grid grid-cols-2 gap-3">
        {(['text', 'number', 'dropdown', 'checkbox', 'radio', 'date'] as FieldType[]).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setNewField(prev => ({ ...prev, type }));
              setFieldCreationStep('details');
            }}
            className="p-3 border rounded-md text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="font-medium capitalize">{type}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFieldDetailsStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Label *
        </label>
        <input
          type="text"
          value={newField.label}
          onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {newField.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placeholder Text
          </label>
          <input
            type="text"
            value={newField.placeholder || ''}
            onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

      <div className="flex items-center">
        <input
          id="field-required"
          type="checkbox"
          checked={newField.required}
          onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="field-required" className="ml-2 block text-sm text-gray-700">
          Required Field
        </label>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => setFieldCreationStep('type')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (needsOptions(newField.type)) {
              setFieldCreationStep('options');
            } else {
              addField();
            }
          }}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {needsOptions(newField.type) ? 'Next: Add Options' : 'Add Field'}
        </button>
      </div>
    </div>
  );

  const renderFieldOptionsStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field Options *
        </label>
        <div className="space-y-2">
          {newField.options?.map((option, index) => (
            <div key={option.id} className="flex items-center">
              <input
                type="text"
                value={option.value}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Option ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Option
        </button>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => setFieldCreationStep('details')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={addField}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Field
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create New Campaign</h1>
          <p className="mt-2 text-sm text-gray-600">
            Build your SMS survey or feedback form
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={campaign.name}
                onChange={handleCampaignChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={campaign.description}
                onChange={handleCampaignChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Form Fields</h2>

              {campaign.form_fields.length > 0 ? (
                <div className="space-y-6 mb-6">
                  {campaign.form_fields.map((field) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4 relative">
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="mb-2">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded uppercase font-semibold">
                          {field.type}
                        </span>
                      </div>
                      {renderFieldPreview(field)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic mb-6">No fields added yet</p>
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {fieldCreationStep === 'type' && 'Select Field Type'}
                  {fieldCreationStep === 'details' && 'Configure Field Details'}
                  {fieldCreationStep === 'options' && 'Add Field Options'}
                </h3>

                {fieldCreationStep === 'type' && renderFieldTypeStep()}
                {fieldCreationStep === 'details' && renderFieldDetailsStep()}
                {fieldCreationStep === 'options' && renderFieldOptionsStep()}

                {errorMessage && (
                  <div className="mt-3 text-sm text-red-600">{errorMessage}</div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || campaign.form_fields.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Campaign'
                )}
              </button>
            </div>

            {successMessage && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
                {successMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCampaign;