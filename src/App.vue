<template>
  <q-layout view="hHh lpR fFf">
    
<!--    <q-header elevated class="bg-primary text-white" height-hint="98">-->
    <q-header elevated class="bg-primary text-white-9 q-py-xs" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left">
          <q-tooltip content-style="font-size: 14px">{{ left | panelBtnTooltip(left) }}</q-tooltip>
        </q-btn>
        
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Проект Octopus
        </q-toolbar-title>
  
        <q-space />
  
        <div class="q-gutter-sm row items-center no-wrap">
          
          <q-btn round dense flat color="white-9" icon="message" v-if="$q.screen.gt.sm">
            <q-tooltip content-style="font-size: 14px">Сообщения</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="white-9" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip content-style="font-size: 14px">Уведомления</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip content-style="font-size: 14px">Профиль</q-tooltip>
            
            <q-menu auto-close>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <q-list style="min-width: 100px">
                    <q-item clickable>
                      <q-item-section>Профиль</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Данные</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable>
                      <q-item-section>Ещё данные</q-item-section>
                    </q-item>
                  </q-list>
                </div>
    
                <q-separator vertical inset class="q-mx-lg" />
    
                <div class="column items-center">
                  <q-avatar size="62px">
                    <img src="https://cdn.quasar.dev/img/avatar4.jpg">
                  </q-avatar>
                  <div class="text-subtitle1">Вася Ложкин</div>
                  <q-btn
                    color="primary"
                    label="Выход"
                    push
                    size="md"
                  />
                </div>
              </div>
              
            </q-menu>
          </q-btn>
          
          <!--  место заглушки для регистрации и авторизации   -->
          
        </div>
  
      </q-toolbar>
      
      <!--      <q-tabs align="left">-->
      <!--        <q-route-tab to="/page1" label="Page One" />-->
      <!--        <q-route-tab to="/page2" label="Page Two" />-->
      <!--        <q-route-tab to="/page3" label="Page Three" />-->
      <!--      </q-tabs>-->
      
    </q-header>
    
    <q-drawer
      show-if-above
      v-model="left"
      side="left"
      bordered
      :width="340"
    >
      
      <!-- drawer content -->
      <LeftMenuSlider/>
      
    </q-drawer>
    
    <!--  Data placement -->
    <q-page-container>
      <!--      <q-page>-->
<!--      <MapLF/>-->
      <MapLF2/>
      
      <!--      </q-page>-->
    </q-page-container>
  
  </q-layout>

</template>

<script>
    import ContentApp from './components/ContentApp.vue'
    import LeftMenuSlider from "./components/LeftMenuSlider";
    // import MapOl from "./components/MapOl";
    import MapLF2 from "./components/MapLF";
    

    export default {
        name: 'LayoutDefault',

        components: {
            // QAvatar
            ContentApp,
            LeftMenuSlider,
            MapLF2
        },

        data() {
            return {
                // leftDrawerOpen: this.$q.platform.is.desktop
                left: false,
                tab: 'mails',
            }
        },
        filters:{
            // tooltip caption
            panelBtnTooltip: function (shower) {
                if (shower) {
                    return ('Скрыть панель')
                } else {
                    return ('Показать панель')
                }
            }
        }
    }
</script>

<style>
  @import "../node_modules/leaflet/dist/leaflet.css";
  .leaflet-fake-icon-image-2x {
    background-image: url(../node_modules/leaflet/dist/images/marker-icon-2x.png);
  }
  .leaflet-fake-icon-shadow {
    background-image: url(../node_modules/leaflet/dist/images/marker-shadow.png);
  }
  body {
    margin: 0px;
    font-family: Helvetica, Verdana, sans-serif;
  }
  #side {
    float: left;
    width: 208px;
  }
  #full_div {
    position: absolute;
    overflow-x: auto;
    top: 0;
    right: 0;
    left: 208px;
    bottom: 0;
    padding-left: 8px;
    border-left: 1px solid #ccc;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  li {
    font: 200 15px/1.5 Helvetica, Verdana, sans-serif;
    border-bottom: 1px solid #ccc;
  }
  li:last-child {
    border: none;
  }
  li a {
    font-size: 15px;
    padding-left: 8px;
    text-decoration: none;
    color: #000;
    display: block;
    -webkit-transition: font-size 0.3s ease, background-color 0.3s ease;
    -moz-transition: font-size 0.3s ease, background-color 0.3s ease;
    -o-transition: font-size 0.3s ease, background-color 0.3s ease;
    -ms-transition: font-size 0.3s ease, background-color 0.3s ease;
    transition: font-size 0.3s ease, background-color 0.3s ease;
  }
  li a:hover {
    font-size: 20px;
    background: #f6f6f6;
  }
  .q-card__section p {
    padding: 0;
    margin: 0 0 5px;
  }
</style>
