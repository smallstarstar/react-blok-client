<template>
  <div>
    <div class="cotainer">
      <div v-for="(item, index) in listData" :key="index" class="center">
        <div class="right">
          <div class="user_info">
            <div v-if="item.userImg === null">
              <div
                style="font-size: 20px"
                :title="item.userInfo.userName"
              >{{item.userInfo.userName[0].toUpperCase()}}</div>
            </div>
            <div class="button_care">
              <div v-if="userInfo">
                <el-button
                  type="success"
                  v-if="item.articleEntity.authorId !== userInfo.id"
                  size="mini"
                  icon="el-icon-plus"
                >{{$t('ArticleBlok.Care')}}</el-button>
              </div>
              <div v-else>
                <el-button type="success" size="mini" icon="el-icon-plus">{{$t('ArticleBlok.Care')}}</el-button>
              </div>
            </div>
          </div>
          <div class="type">{{item.articleEntity.typeId}}</div>
          <div class="type">{{item.articleEntity.subTypeId}}</div>
          <div class="time_info">{{timeServices.changeStateTime(item.articleEntity.cTime)}}</div>
        </div>
        <div class="left">
          <div class="left_button">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-right"
              @click="goInto(item)"
            >{{$t('ArticleBlok.InTo')}}</el-button>
          </div>
          <div class="titleName">{{item.articleEntity.articleName}}</div>
          <div class="desc">{{item.articleEntity.desc}}</div>
          <div class="operate">
            <div :title="$t('ArticleBlok.Commit')">
              <i class="iconfont icon-message"></i>
              <div style="position:relative;left: 7px;color:#f2784b">{{item.commentList}}</div>
            </div>
            <div :title="$t('ArticleBlok.View')">
              <i class="el-icon-view"></i>
              <div style="position:relative;left: 7px;color:#f2784b">{{item.articleEntity.looks}}</div>
            </div>
            <div :title="$t('ArticleBlok.Collection')">
              <i class="iconfont icon-good" @click="updateStars(item.articleEntity.id)"></i>
              <div style="position:relative;left: 7px;color:#f2784b">{{item.articleEntity.stars}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分业查询 -->
    <div class="page_size">
      <el-pagination
        @size-change="handleCurrentSize"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PageInfo } from "@/models/page-info";
import ArticlesServices from "@/api/articles-services";
import timeFormat from "@/utils/timeFormat";
import rxEvent from "pubsub-js";
import EventKeys from "@/common/event-keys";
import { Getter, Action } from "vuex-class";
@Component({
  components: {}
})
export default class Articles extends Vue {
  @Getter("userInfo")
  userInfo!: any;
  @Action("saveArticleInfo")
  saveArticleInfo!: any;
  private pageInfo: PageInfo = new PageInfo();
  private listData: Array<[]> = [];
  private currentPage: Number = 0;
  private currentSize: Number = 5;
  private timeServices: any = timeFormat;
  private total: Number = 0;
  async created() {
    await this.getInit(this.pageInfo);
  }
  mounted() {
    rxEvent.subscribe(
      EventKeys.REFRESH_ARTICLE_BLOK,
      async (name: any, val: any) => {
        await this.getInit(this.pageInfo);
      }
    );
  }
  async getInit(pageInfo: PageInfo) {
    const data: any = await ArticlesServices.getArticlesBypageAndSize(pageInfo);
    this.listData = data.list;
    this.total = data.total;
  }
  async handleCurrentSize(size: Number) {
    this.pageInfo.size = size;
    await this.getInit(this.pageInfo);
  }
  async handleCurrentChange(val: Number) {
    this.pageInfo.page = val;
    await this.getInit(this.pageInfo);
  }
  async goInto(e: any) {
    // 路由条状以及将数据存入store中
    this.saveArticleInfo(e);
    this.$router.push({
      path: "/article-detail"
    });
    ArticlesServices.updateArticleLooks(e.articleEntity.id);
  }
  async updateStars(e: any) {
    // 判断是否存在id
    if (!this.userInfo) {
      this.$message.warning(this.$t("ArticleBlok.PleaseLogin") as string);
    } else {
      let data = await ArticlesServices.updateArticleStars(e);
      if (data) {
        await this.getInit(this.pageInfo);
        this.$message.success(this.$t("ArticleBlok.SupportSuccess") as string);
      }
    }
  }
}
</script> 
<style lang="scss" scoped>
@import "./index.scss";
</style>