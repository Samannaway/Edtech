let page = null

const changePage = (newPage)=>{
    page = newPage
    console.log("change triggered")
    console.log(newPage)
}

export {page, changePage}