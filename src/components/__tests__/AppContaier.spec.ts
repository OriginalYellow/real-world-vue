import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AppContainer from '../AppContainer.vue'
import DataGrid from '../dataGrid/DataGrid.vue'
import DetailsView from '../DetailsView.vue'

// Mock the API service
vi.mock('../../services/apiService', () => ({
  fetchGridData: vi.fn(() => Promise.resolve([
    { key: '1', type: 'Type1', label: 'Label1' },
    { key: '2', type: 'Type2', label: 'Label2' },
  ])),
  fetchGridItemDetails: vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ detail: 'Item Details' }), 100))),
}))

describe('AppContainer', () => {
  it('renders correctly', () => {
    const wrapper = mount(AppContainer)
    expect(wrapper.exists()).toBeTruthy()
  })

  it('displays loading spinner when a row is clicked, then stops when data loaded', async () => {
    vi.useFakeTimers()
    const wrapper = mount(AppContainer)
    await flushPromises() // Wait for initial data to load

    // Simulate row selection
    await wrapper.findComponent(DataGrid).vm.$emit('update:selectedKeys', new Set(['1']))

    // Check if DetailsView is rendered
    const detailsView = wrapper.findComponent(DetailsView)
    expect(detailsView.exists()).toBe(true)

    // Check if the spinner is displayed
    expect(detailsView.props('loading')).toBe(true)
    expect(detailsView.find('.spinner').exists()).toBe(true)

    // Wait for the API call to resolve
    vi.runAllTimers()
    await flushPromises()

    // Check if the spinner is no longer displayed
    expect(detailsView.props('loading')).toBe(false)
    expect(detailsView.find('.spinner').exists()).toBe(false)

    // Check if the details are displayed
    expect(detailsView.props('details')).toEqual({ detail: 'Item Details' })

    vi.useRealTimers()
  })
})