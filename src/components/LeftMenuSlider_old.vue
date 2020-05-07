<template>
  <div class="q-pa-md" style="max-width: 350px; line-height: 1.2;">
    
    <q-tabs
      v-model="tabActive"
      dense
      class="text-grey"
      active-color="orange"
      indicator-color="white"
      align="left"
      no-caps
      narrow-indicator
    >
      <q-tab name="home" label="Главная"/>
      <q-tab name="pagePassport" label="Паспорт"/>
    </q-tabs>
    
    <q-tab-panels v-model="tabActive" animated>
      <q-tab-panel name="home">
        
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            group="somegroup2"
            expand-separator
            icon="layers"
            label="Режим отображения"
            header-class="text-primary"
          >
            <q-card>
              <q-card-section>
                <div class="q-option-group q-gutter-sm">
                  <q-radio v-model="mapLayerViewMode" val="osm" label="Валидация" /><br/>
                  <q-radio v-model="mapLayerViewMode" val="ya" label="Задания" />
                </div>.
              </q-card-section>
            </q-card>
          </q-expansion-item>
  
          <q-expansion-item
            group="somegroup2"
            expand-separator
            icon="filter_list"
            label="Фильтр"
            header-class="text-primary"
            default-opened
          >
            <q-card>
              <q-card-section>
                <div class="q-option-group q-gutter-sm">
                  <q-radio v-model="mapViewMode" val="all" label="Всё" default/><br/>
                  <q-radio v-model="mapViewMode" val="Пустые объекты" label="Объекты с ошибками" />
                  <q-radio v-model="mapViewMode" val="Объекты с данными" label="Объекты без ошибок" />
                </div>.
              </q-card-section>
            </q-card>
          </q-expansion-item>
          
        </q-list>
      </q-tab-panel>
      
      <q-tab-panel name="pagePassport">
        
        <q-card flat bordered style="border-bottom: none">
          <q-card-section>
            
            <element-to-form :o-editable="isEditable" :o-caption="passport.case_number" o-label="Номер паспорта"/>
            <element-to-form :o-editable="isEditable" :o-caption="passport.revision_number" o-label="Ревизия"/>
            <element-to-form :o-editable="isEditable" :o-caption="passport.revision_description"
                             o-label="Описание изменений"/>
<!--        <element-to-form o-editable="222" o-input-type="string" @update="updateData"-->
<!--          :o-caption="passport.revision_description"-->
<!--          o-label="Описание изменений"/>-->
          
          </q-card-section>
        </q-card>
        
        <q-list @show:this="testMethod(evt)" :bordered="bodreredR">
          
          <q-expansion-item
            group="somegroup"
            icon="settings_input_component"
            label="Дорожный контроллер"
            default-opened
            header-class="text-primary"
            @hide="testMethod"
            @show="testMethod"
          >
            <q-card>
              <q-card-section>
                <element-to-form :o-editable="isEditable" :o-caption="passportRC.rcInfo.type" o-label="Тип"
                                 o-input-type="select" :o-select-data=controllerTypes />
                <element-to-form o-editable="222" :o-caption="passportRC.rcInfo.type" o-label="Тип"
                                 o-input-type="select" :o-select-data=controllerTypes />
                <element-to-form :o-editable="isEditable" :o-caption="passportRC.rcInfo.firmware"
                                 o-label="Версия прошивки"/>
                <element-to-form :o-editable="isEditable" :o-caption="passportRC.rcInfo.ip" o-label="IP Адрес"/>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          
          <q-separator/>
          
          
          <q-expansion-item
            group="somegroup"
            icon="traffic"
            label="Светофоры"
            header-class="text-primary"
            @hide="testMethod"
            @show="testMethod"
          >
            <q-card>
              <q-card-section>
              
<!--            <li v-for="sg in passport.road_controller.signal_groups" v-bind:key="sg.id">-->
<!--              {{ sg.id }}-->
<!--              {{ sg.type }}-->
<!--              <span v-if="sg.add_green != undefined">zzz {{ sg.add_green }}</span>-->
<!--            </li>-->
                
                <q-list padding class="rounded-borders"
                        v-for="sg in passport.road_controller.signal_groups"
                        v-bind:key="sg.id">
                  <q-expansion-item
                    dense
                    dense-toggle
                    expand-separator
                    icon="list"
                  >
                    <template v-slot:header>
                      {{ sg.id }}
                      {{ prepareSelect(signalGroupTypes, sg.type)}}
                    </template>
                    <q-card>
                      <q-card-section>
                        <element-to-form :o-editable="isEditable" :o-caption="sg.add_green"
                                         o-label="Длительность дополнительного зелёного"/>
                        <element-to-form :o-editable="isEditable" :o-caption="sg.green_blink"
                                         o-label="Длительность зелёного"/>
                        <element-to-form :o-editable="isEditable" :o-caption="sg.yellow"
                                         o-label="Длительность жёлтого"/>
                        <element-to-form :o-editable="isEditable" :o-caption="sg.add_red"
                                         o-label="Длительность дополнительного красного"/>
                        <element-to-form :o-editable="isEditable" :o-caption="sg.red_yellow"
                                         o-label="Длительность красно-жёлтого"/>
                        <element-to-form :o-editable="isEditable" :o-caption="sg.add_green2"
                                         o-label="Длительность дополнительного зелёного перед выключением"/>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              
              </q-card-section>
            </q-card>
          </q-expansion-item>
          
          <q-separator/>
          
<!--      <q-expansion-item-->
<!--        group="somegroup"-->
<!--        icon="done_outline"-->
<!--        label="Second"-->
<!--        header-class="text-teal">-->
<!--        <q-card>-->
<!--          <q-card-section>dsdsd-->
<!--            <q-icon name="leaflet/dist/images/marker-icon.png" />-->
<!--          </q-card-section>-->
<!--        </q-card>-->
<!--      </q-expansion-item>-->
        
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
    import { EventBus } from "../eventBus";
    import passport from '../data/pasport_e1';
    // import passport from '../data/pasport_e2';
    import controllerTypes from '../data/controllerTypes'
    import signalGroupTypes from '../data/signalGroupTypes'
    import ElementToForm from './ElementToForm'
    
    export default {
        name: 'LeftMenuSlider_old',
        components: {ElementToForm},
        data() {
            return {
                isEditable: '111', // todo: переделать под булев
                tabActive: 'home',
                mapLayerViewMode: 'osm',
                mapViewMode: 'all',
                bodreredR: true,
                passport: passport,
                passportInfo: [
                    passport.case_number,
                    passport.revision_number,
                    passport.revision_description,
                ],
                passportRC: {
                    rcInfo: {
                        'type': passport.road_controller.type,
                        'firmware': passport.road_controller.firmware,
                        'ip': passport.road_controller.ip,
                    },
                    rcShape: passport.road_controller.shape,
                    rcSG: passport.road_controller.signal_groups,
                },
                controllerTypes: controllerTypes,
                signalGroupTypes: signalGroupTypes,
                
            }
        },
        mounted: function () {
            // this.buildResults();
            // console.log(passport.revision_description)
        },
        watch: {
            mapViewMode: function (e) {
                this.eventMapViewMode(e);
            }
        },
        methods: {
            // todo: clean
            testMethod (data) {
                // console.log('execute testMethod');
                // this.zoom = zoom;
                // if (this.bodreredR) { this.bodreredR = false;}
                // else { this.bodreredR = true; }
                EventBus.$emit("testData", 'Data from EventBus');
            },
            eventMapViewMode: function(e) {
                EventBus.$emit("mapViewMode", e);
            },
            buildResults: function(event) {
                this.passport = JSON.parse(passport);
                console.log(this.passport);
            },
            updateData: function (data) {
                console.log(data)
            },
            prepareSelect:  function (dataList, elemId) {
                var res = dataList.find(x => x.id === elemId);
                if (res['description'] == undefined) {
                    return res['type'];
                } else {
                    return res['description'];
                }
            }
        },
    }
</script>