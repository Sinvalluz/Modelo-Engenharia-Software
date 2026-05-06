import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		// origin: [env.APP_URL],
		// credentials: true,
	});

	app.useGlobalPipes(
  		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('Documentação da api')
		.setDescription('A descrição da api')
		.addBearerAuth()
		.setVersion('1.0')
		.build();

		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('docs', app, document);
	}

	await app.listen(env.PORT ?? 3000);
}

bootstrap();
