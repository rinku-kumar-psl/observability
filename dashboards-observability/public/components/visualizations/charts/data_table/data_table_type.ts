/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataTable } from './data_table';
import { getPlotlySharedConfigs, getPlotlyCategory } from '../shared/shared_configs';
import { LensIconChartDatatable } from '../../assets/chart_datatable';
import { ConfigEditor } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/json_editor';
import { ConfigAvailability } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls/config_availability';
import { VizDataPanel } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/default_vis_editor';
import {
  InputFieldItem,
  SwitchButton,
  ConfigChartOptions,
  ButtonGroupItem,
} from './../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls';

const sharedConfigs = getPlotlySharedConfigs();
const VIS_CATEGORY = getPlotlyCategory();

export const createDatatableTypeDefinition = (params: any = {}) => ({
  name: 'data_table',
  type: 'data_table',
  id: 'data_table',
  label: 'Table View',
  fullLabel: 'Table View',
  iconType: 'visTable',
  category: VIS_CATEGORY.BASICS,
  selection: {
    dataLoss: 'nothing',
  },
  icon: LensIconChartDatatable,
  showtableheader: true,
  enablepagination: true,
  editorConfig: {
    panelTabs: [
      {
        id: 'data-panel',
        name: 'Data',
        mapTo: 'dataConfig',
        editor: VizDataPanel,
        sections: [
          {
            id: 'chart-styles',
            name: 'Chart styles',
            editor: ConfigChartOptions,
            mapTo: 'chartStyles',
            schemas: [
              {
                title: 'Show table header',
                name: 'Show table header',
                component: SwitchButton,
                mapTo: 'showTableHeader',
                eleType: 'switchButton',
                currentValue: true,
              },
              {
                title: 'Enable pagination',
                name: 'Enable pagination',
                component: SwitchButton,
                mapTo: 'enablePagination',
                eleType: 'switchButton',
                currentValue: true,
              },
              {
                name: 'Column alignment',
                component: ButtonGroupItem,
                mapTo: 'columnAlignment',
                eleType: 'buttons',
                props: {
                  options: [
                    { name: 'Auto', id: 'auto' },
                    { name: 'Left', id: 'left' },
                    { name: 'Center', id: 'center' },
                    { name: 'Right', id: 'right' },
                  ],
                  defaultSelections: [{ name: 'Auto', id: 'auto' }],
                },
              },
              {
                title: 'Minimum column width',
                name: 'Minimum column width',
                component: InputFieldItem,
                mapTo: 'minColumnWidth',
                eleType: 'input',
              },
              {
                title: 'Column With',
                name: 'Column With',
                component: InputFieldItem,
                mapTo: 'columnWidth',
                eleType: 'input',
              },
              {
                title: 'Column filter',
                name: 'Column filter',
                component: SwitchButton,
                mapTo: 'colunmFilter',
                eleType: 'switchButton',
                currentValue: false,
              },
              {
                title: 'Show table footer',
                name: 'Show table footer',
                component: SwitchButton,
                mapTo: 'showTableFooter',
                eleType: 'switchButton',
                currentValue: false,
              },
            ],
          },
        ],
      },
      {
        id: 'style-panel',
        name: 'Layout',
        mapTo: 'layoutConfig',
        editor: ConfigEditor,
        content: [],
      },
      {
        id: 'availability-panel',
        name: 'Availability',
        mapTo: 'availabilityConfig',
        editor: ConfigAvailability,
      },
    ],
  },
  visConfig: {
    layout: {
      ...sharedConfigs.layout,
    },
    config: {
      ...sharedConfigs.config,
    },
    isUniColor: false,
  },
  component: DataTable,
});
