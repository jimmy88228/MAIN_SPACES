import AudioImg from "@/assets/images/custom/audio.png"
import VideoImg from "@/assets/images/custom/video.png"
import ArticleImg from "@/assets/images/custom/article.png"
import BroadcastImg from "@/assets/images/custom/broadcast.png"
export default{ 
    data(){
        return {
            keyInfo: {
                'video':{
                    paramsType:1,
                    name:"视频",
                    groupKey:'videosGroup',
                    groupItemKey:"videos",
                    img:VideoImg,
                },
                'audio':{
                    paramsType:2,
                    name:"音频", 
                    groupKey:'audiosGroup',
                    groupItemKey:"audios",
                    img:AudioImg,
                },
                'article':{
                    paramsType:3,
                    name:"文章",
                    groupKey:'articlesGroup',
                    groupItemKey:"articles",
                    img:ArticleImg,
                },
                'broadcast':{
                    paramsType:4,
                    name:"广播",
                    groupKey:'broadcastGroup',
                    groupItemKey:"broadcast", 
                    img:BroadcastImg,
                } 
            },
        }
    }
}