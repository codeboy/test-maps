<template>
  <div v-if="oCaption != undefined">
    
    <p v-if="(oEditable==111 && oInputType=='string')">
      <b>{{ oLabel }}:</b> {{ oCaption }}
    </p>
    <p v-else-if="(oEditable==111 && oInputType=='select')">
      <b>{{ oLabel }}:</b> {{ localCaption }}
    </p>
    
    <p v-else-if="(oEditable==222 && oInputType=='string')">
<!--      trrr {{ oInputType }} {{ oCaption }}-->
<!--      <q-select v-model="oCaption" :options="options" label="Standard" />-->
      <q-input v-model="localCaption" :label="oLabel"/>
    </p>
    <p v-else-if="(oEditable==222 && oInputType=='select')">
      <q-select v-model="localCaption" :options="oSelectData" :label="oLabel"
                option-value="id"
                option-label="type"
                option-disable="inactive"
                emit-value
                map-options
      />
    </p>
  </div>
</template>

<script>
    import { EventBus } from "../eventBus";

    export default {
        name: 'ElementToForm',
        data() {
            return {
                localCaption: this.oCaption,
                // inputTypee: this.inputType,
            }
        },
        props: {
            oEditable: {
                default: '111',
                type: String
            },
            oCaption: [String, Number],
            oLabel: {
                default: '',
                type: String
            },
            oSelectData: Array,
            oInputType: {
              default: 'string', // string, text, select
              type: String
            }
        },
        watch: {
            localCaption (data) {
                this.$emit('update', data)
            }
        },
        mounted: function () {
            this.findElement('zz', 'ff');
        },
        methods: {
            findElement: function (dataList, elemId) {
                if (this.oSelectData != undefined) {
                    var res = this.oSelectData.find(x => x.id === 2);
                    if (res['description'] == undefined) {
                        this.localCaption = res['type'];
                    } else {
                        this.localCaption = res['description'];
                    }
                }
            }
        },
    }
</script>