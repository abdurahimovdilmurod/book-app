import { Router } from "express";
import { CategoryDto } from "../dto/category.dto";
import { validateIt } from "../common/validate";
import { Category } from "../model/category.model";
import { Types } from "mongoose";


export const categoryRouter = Router();

async function parser(body:object):Promise<CategoryDto> {
    const dto = new CategoryDto();
    
    if(!body || typeof body !== 'object') throw Error('Body undefined or is not an object');

    Object.keys(body).forEach(key => {
        dto[key as keyof CategoryDto] = body[key as keyof object]
    })

    return dto;
};

categoryRouter.get('/', async (req, res)=> {
    const category = await Category.find({isDeleted: false}).sort('name');
    return res.send(category);
});

categoryRouter.get('/:id', async (req, res)=> {
    const category = await Category.findOne({_id: new Types.ObjectId(req.params.id), isDeleted: false});
    if(!category){
        return res.status(404).send("Bunday ID li kitob topilmadi");
    }
    return res.send(category);
});

categoryRouter.post('/', async (req, res) => {
    try {
        const data = await parser(req.body);

        const result = await validateIt(data);
        await new Category(result).save();
        res.send(result);
    }
    catch(error) {
        console.log(error);
        res.status(400).send(error);
    }
});

categoryRouter.put('/:id', async (req, res)=>{
    try {
        const data = await parser(req.body);

        const result = await validateIt(data);
        
        const category = await Category.findOneAndUpdate({_id: new Types.ObjectId(req.params.id), isDeleted: false}, 
            result, 
            {new: true}
        );
        return res.send(category);

    }
    catch(error) {
        console.log(error);
        res.status(400).send(error);
    }
});

categoryRouter.delete('/:id', async (req, res)=>{
    const category = await Category.findOne({_id: new Types.ObjectId(req.params.id), isDeleted: false});
    if(!category){
        return res.status(404).send("Bunday ID li kitob topilmadi");
    }
    category.isDeleted = true;
    await category.save();
    return res.send(category);
});


