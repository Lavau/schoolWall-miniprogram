// pages/register/register.js
Page({
  data: {
    select: false,
    year: null,
    grade_name: '--请选择--',
    grades: ['1班', '2班', '3班', ]
  },

  bindShowMsg: function() {
    this.setData({
      select: !this.data.select
    })
  },

  mySelect: function(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      grade_name: name,
      select: false
    })
  },

  onLoad: function() {
    let date = new Date();
    this.data.year = date.getFullYear();
  }
})
