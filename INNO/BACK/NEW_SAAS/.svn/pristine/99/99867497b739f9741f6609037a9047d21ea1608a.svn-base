<style lang="less">
</style>

<template>
	<div>
		<Row>
	        <Col span="11">
	            <Card>
	                <p slot="title">phpMyAdmin 入口</p>
	                <p>&nbsp;</p>
	                <p>为了数据库安全，不让外网直接访问，只可通过phpMyAdmin进入管理。</p>
	                <p>&nbsp;</p>
	                <p><Button type="success" @click="goPHPmyadmin" long>进入管理</Button></p>
	            </Card>
	        </Col>
	        <Col span="11" offset="1">
	        	<!--
	            <Card>
	                <p slot="title">Disable card with hover shadows</p>
	                <p>Content of card</p>
	                <p>Content of card</p>
	                <p>Content of card</p>
	            </Card>
	            -->
	        </Col>
	    </Row>
	</div>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {
    }
  },
  methods: {
    init () {
    },
    goPHPmyadmin () {
      window.open('http://' + window.location.hostname + '/phpmyadmin9527/');
    }
  },
  mounted () {
    this.init();
  }
}
</script>
